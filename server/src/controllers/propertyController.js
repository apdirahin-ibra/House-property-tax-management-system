import { AppError } from '../middleware/errorHandler.js';
import Owner from '../models/Owner.js';
import Property from '../models/Property.js';
import { generatePropertyCode } from '../utils/generatePropertyCode.js';
import { logAudit, getClientIp } from '../services/auditService.js';

export const getProperties = async (req, res, next) => {
  try {
    const { search, zone, propertyType, status } = req.query;
    const filter = {};

    if (zone) filter.zone = zone;
    if (propertyType) filter.propertyType = propertyType;
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { propertyCode: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
        { zone: { $regex: search, $options: 'i' } },
      ];
    }

    const properties = await Property.find(filter)
      .populate('ownerId', 'fullName phone email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

export const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'ownerId',
      'fullName phone email address nationalId'
    );

    if (!property) {
      throw new AppError('Property not found', 404);
    }

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

export const createProperty = async (req, res, next) => {
  try {
    const owner = await Owner.findById(req.body.ownerId);
    if (!owner) {
      throw new AppError('Owner not found', 404);
    }

    const propertyCode =
      req.body.propertyCode?.toUpperCase() || (await generatePropertyCode());

    const property = await Property.create({
      ...req.body,
      propertyCode,
    });

    const populated = await Property.findById(property._id).populate(
      'ownerId',
      'fullName phone email'
    );

    await logAudit({
      actorId: req.user._id,
      action: 'CREATE',
      entityType: 'Property',
      entityId: property._id,
      description: `Registered property ${property.propertyCode}`,
      ipAddress: getClientIp(req),
    });

    res.status(201).json({
      success: true,
      message: 'Property registered successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (req, res, next) => {
  try {
    if (req.body.ownerId) {
      const owner = await Owner.findById(req.body.ownerId);
      if (!owner) {
        throw new AppError('Owner not found', 404);
      }
    }

    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('ownerId', 'fullName phone email');

    if (!property) {
      throw new AppError('Property not found', 404);
    }

    await logAudit({
      actorId: req.user._id,
      action: 'UPDATE',
      entityType: 'Property',
      entityId: property._id,
      description: `Updated property ${property.propertyCode}`,
      ipAddress: getClientIp(req),
    });

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

export const getOwnerProperties = async (req, res, next) => {
  try {
    const owner = await Owner.findOne({ userId: req.user._id });

    if (!owner) {
      return res.json({
        success: true,
        count: 0,
        data: [],
        message: 'No owner profile linked to this account',
      });
    }

    const properties = await Property.find({ ownerId: owner._id, status: 'active' })
      .populate('ownerId', 'fullName phone email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};
