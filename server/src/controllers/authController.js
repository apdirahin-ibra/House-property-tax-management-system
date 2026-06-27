import { AppError } from '../middleware/errorHandler.js';
import User from '../models/User.js';
import { comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (user.status !== 'active') {
      throw new AppError('Account is inactive. Contact an administrator.', 403);
    }

    const isMatch = await comparePassword(password, user.passwordHash);

    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = signToken({ id: user._id, role: user.role });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: user.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};
