import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || (nodeEnv === 'production' ? '' : 'dev-secret-change-in-production'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || (nodeEnv === 'production' ? '' : 'http://localhost:5173'),
};

if (env.nodeEnv === 'production' && !env.jwtSecret) {
  throw new Error('JWT_SECRET is required in production');
}
