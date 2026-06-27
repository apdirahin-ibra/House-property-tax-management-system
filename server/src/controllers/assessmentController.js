import { AppError } from '../middleware/errorHandler.js';
import Property from '../models/Property.js';
import TaxRate from '../models/TaxRate.js';
import Assessment from '../models/Assessment.js';
import { calculateBaseTax, calculateTotalDue } from '../services/taxCalculation.js';
import { logAudit, getClientIp } from '../services/auditService.js';

export const generateAssessment = async (req, res, next) => {
  try {
    const { propertyId, taxYear, penalty = 0, discount = 0 } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      throw new AppError('Property not found', 404);
    }

    if (property.status !== 'active') {
      throw new AppError('Cannot assess an inactive property', 400);
    }

    const existing = await Assessment.findOne({ propertyId, taxYear });
    if (existing) {
      throw new AppError(`Assessment already exists for tax year ${taxYear}`, 409);
    }

    const taxRate = await TaxRate.findOne({
      zone: property.zone,
      propertyType: property.propertyType,
      taxYear,
    });

    if (!taxRate) {
      throw new AppError(
        `No tax rate found for zone "${property.zone}", type "${property.propertyType}", year ${taxYear}`,
        404
      );
    }

    const baseTax = calculateBaseTax(taxRate, property.assessedValue);
    const totalDue = calculateTotalDue(baseTax, penalty, discount);

    const assessment = await Assessment.create({
      propertyId,
      taxYear,
      baseTax,
      penalty,
      discount,
      totalDue,
      assessedBy: req.user._id,
    });

    const populated = await Assessment.findById(assessment._id)
      .populate('propertyId')
      .populate('assessedBy', 'name email');

    await logAudit({
      actorId: req.user._id,
      action: 'GENERATE',
      entityType: 'Assessment',
      entityId: assessment._id,
      description: `Generated assessment for property ${property.propertyCode} (${taxYear})`,
      ipAddress: getClientIp(req),
    });

    res.status(201).json({
      success: true,
      message: 'Assessment generated successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

export const getAssessments = async (req, res, next) => {
  try {
    const { taxYear, propertyId } = req.query;
    const filter = {};

    if (taxYear) filter.taxYear = Number(taxYear);
    if (propertyId) filter.propertyId = propertyId;

    const assessments = await Assessment.find(filter)
      .populate({ path: 'propertyId', populate: { path: 'ownerId', select: 'fullName' } })
      .populate('assessedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: assessments.length,
      data: assessments,
    });
  } catch (error) {
    next(error);
  }
};

export const getAssessmentById = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('propertyId')
      .populate('assessedBy', 'name email');

    if (!assessment) {
      throw new AppError('Assessment not found', 404);
    }

    res.json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
};
