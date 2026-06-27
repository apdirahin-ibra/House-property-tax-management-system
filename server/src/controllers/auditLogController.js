import AuditLog from '../models/AuditLog.js';

export const getAuditLogs = async (req, res, next) => {
  try {
    const { action, entityType, search, from, to } = req.query;
    const filter = {};

    if (action) filter.action = action;
    if (entityType) filter.entityType = entityType;

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } },
        { entityType: { $regex: search, $options: 'i' } },
      ];
    }

    const logs = await AuditLog.find(filter)
      .populate('actorId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};
