import { AppError } from './errorHandler.js';

export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));

      return next(new AppError(errors.map((e) => e.message).join(', '), 400));
    }

    req.body = result.data;
    next();
  };
};
