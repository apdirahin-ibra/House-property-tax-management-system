import { AppError } from '../middleware/errorHandler.js';
import User from '../models/User.js';
import { hashPassword } from '../utils/password.js';
import { logAudit, getClientIp } from '../services/auditService.js';

export const getUsers = async (req, res, next) => {
  try {
    const { role, status, search } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users.map((u) => u.toSafeObject()),
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, status } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new AppError('Email already in use', 409);
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      status: status || 'active',
    });

    await logAudit({
      actorId: req.user._id,
      action: 'CREATE',
      entityType: 'User',
      entityId: user._id,
      description: `Created user ${user.email} with role ${user.role}`,
      ipAddress: getClientIp(req),
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, email, password, role, status } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (email && email.toLowerCase() !== user.email) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        throw new AppError('Email already in use', 409);
      }
      user.email = email.toLowerCase();
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (status) user.status = status;
    if (password) {
      user.passwordHash = await hashPassword(password);
    }

    await user.save();

    await logAudit({
      actorId: req.user._id,
      action: 'UPDATE',
      entityType: 'User',
      entityId: user._id,
      description: `Updated user ${user.email}`,
      ipAddress: getClientIp(req),
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

export const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user._id.equals(req.user._id)) {
      throw new AppError('You cannot deactivate your own account', 400);
    }

    user.status = 'inactive';
    await user.save();

    await logAudit({
      actorId: req.user._id,
      action: 'DEACTIVATE',
      entityType: 'User',
      entityId: user._id,
      description: `Deactivated user ${user.email}`,
      ipAddress: getClientIp(req),
    });

    res.json({
      success: true,
      message: 'User deactivated successfully',
      data: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};
