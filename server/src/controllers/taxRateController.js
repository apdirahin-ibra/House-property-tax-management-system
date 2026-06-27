import { AppError } from '../middleware/errorHandler.js';
import TaxRate from '../models/TaxRate.js';
import { logAudit, getClientIp } from '../services/auditService.js';

export const getTaxRates = async (req, res, next) => {
  try {
    const { zone, propertyType, taxYear } = req.query;
    const filter = {};

    if (zone) filter.zone = zone;
    if (propertyType) filter.propertyType = propertyType;
    if (taxYear) filter.taxYear = Number(taxYear);

    const taxRates = await TaxRate.find(filter)
      .populate('createdBy', 'name email')
      .sort({ taxYear: -1, zone: 1 });

    res.json({
      success: true,
      count: taxRates.length,
      data: taxRates,
    });
  } catch (error) {
    next(error);
  }
};

export const createTaxRate = async (req, res, next) => {
  try {
    const taxRate = await TaxRate.create({
      ...req.body,
      createdBy: req.user._id,
    });

    const populated = await TaxRate.findById(taxRate._id).populate(
      'createdBy',
      'name email'
    );

    await logAudit({
      actorId: req.user._id,
      action: 'CREATE',
      entityType: 'TaxRate',
      entityId: taxRate._id,
      description: `Created tax rate for ${taxRate.zone}/${taxRate.propertyType} (${taxRate.taxYear})`,
      ipAddress: getClientIp(req),
    });

    res.status(201).json({
      success: true,
      message: 'Tax rate created successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaxRate = async (req, res, next) => {
  try {
    const taxRate = await TaxRate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email');

    if (!taxRate) {
      throw new AppError('Tax rate not found', 404);
    }

    await logAudit({
      actorId: req.user._id,
      action: 'UPDATE',
      entityType: 'TaxRate',
      entityId: taxRate._id,
      description: `Updated tax rate for ${taxRate.zone}/${taxRate.propertyType} (${taxRate.taxYear})`,
      ipAddress: getClientIp(req),
    });

    res.json({
      success: true,
      message: 'Tax rate updated successfully',
      data: taxRate,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTaxRate = async (req, res, next) => {
  try {
    const taxRate = await TaxRate.findByIdAndDelete(req.params.id);

    if (!taxRate) {
      throw new AppError('Tax rate not found', 404);
    }

    await logAudit({
      actorId: req.user._id,
      action: 'DELETE',
      entityType: 'TaxRate',
      entityId: taxRate._id,
      description: `Deleted tax rate for ${taxRate.zone}/${taxRate.propertyType} (${taxRate.taxYear})`,
      ipAddress: getClientIp(req),
    });

    res.json({
      success: true,
      message: 'Tax rate deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
