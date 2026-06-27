import AuditLog from '../models/AuditLog.js';

export const logAudit = async ({
  actorId,
  action,
  entityType,
  entityId = null,
  description,
  ipAddress = null,
}) => {
  try {
    await AuditLog.create({
      actorId,
      action,
      entityType,
      entityId,
      description,
      ipAddress,
    });
  } catch (error) {
    console.error('Audit log failed:', error.message);
  }
};

export const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || null;
};
