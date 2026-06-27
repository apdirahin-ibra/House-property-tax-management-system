import { AppError } from '../middleware/errorHandler.js';
import Owner from '../models/Owner.js';
import User from '../models/User.js';
import { logAudit, getClientIp } from '../services/auditService.js';

const resolveOwnerUserId = async (payload, currentOwnerId = null) => {
  const nextPayload = { ...payload };

  if (nextPayload.userId === '') {
    nextPayload.userId = null;
  }

  let user = null;
  if (nextPayload.userId) {
    user = await User.findById(nextPayload.userId);
    if (!user) {
      throw new AppError('Linked user account not found', 404);
    }
    if (user.role !== 'owner') {
      throw new AppError('Linked user account must have owner role', 400);
    }
  } else if (nextPayload.email) {
    user = await User.findOne({
      email: nextPayload.email.toLowerCase(),
      role: 'owner',
      status: 'active',
    });
    if (user) {
      nextPayload.userId = user._id;
    }
  }

  if (nextPayload.userId) {
    const linkedOwner = await Owner.findOne({ userId: nextPayload.userId });
    if (linkedOwner && (!currentOwnerId || linkedOwner._id.toString() !== currentOwnerId.toString())) {
      throw new AppError('This user account is already linked to another owner profile', 409);
    }
  }

  return nextPayload;
};

export const getOwners = async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { nationalId: { $regex: search, $options: 'i' } },
      ];
    }

    const owners = await Owner.find(filter)
      .populate('userId', 'name email role status')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: owners.length,
      data: owners,
    });
  } catch (error) {
    next(error);
  }
};

export const getOwnerById = async (req, res, next) => {
  try {
    const owner = await Owner.findById(req.params.id).populate(
      'userId',
      'name email role status'
    );

    if (!owner) {
      throw new AppError('Owner not found', 404);
    }

    res.json({
      success: true,
      data: owner,
    });
  } catch (error) {
    next(error);
  }
};

export const createOwner = async (req, res, next) => {
  try {
    const payload = await resolveOwnerUserId(req.body);
    const owner = await Owner.create(payload);
    const populated = await Owner.findById(owner._id).populate(
      'userId',
      'name email role status'
    );

    await logAudit({
      actorId: req.user._id,
      action: 'CREATE',
      entityType: 'Owner',
      entityId: owner._id,
      description: `Registered owner ${owner.fullName}`,
      ipAddress: getClientIp(req),
    });

    res.status(201).json({
      success: true,
      message: 'Owner registered successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOwner = async (req, res, next) => {
  try {
    const existingOwner = await Owner.findById(req.params.id);
    if (!existingOwner) {
      throw new AppError('Owner not found', 404);
    }

    const payload = await resolveOwnerUserId(req.body, existingOwner._id);

    const owner = await Owner.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    }).populate('userId', 'name email role status');

    await logAudit({
      actorId: req.user._id,
      action: 'UPDATE',
      entityType: 'Owner',
      entityId: owner._id,
      description: `Updated owner ${owner.fullName}`,
      ipAddress: getClientIp(req),
    });

    res.json({
      success: true,
      message: 'Owner updated successfully',
      data: owner,
    });
  } catch (error) {
    next(error);
  }
};
