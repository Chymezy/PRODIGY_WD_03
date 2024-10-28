import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '8080', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  wsHeartbeat: 30000, // 30 seconds
  roomCleanupInterval: 300000, // 5 minutes
  roomTimeout: 900000, // 15 minutes
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: '7d',
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  inviteCleanupInterval: 60000, // Clean up expired invites every minute
  inviteTimeout: 5 * 60 * 1000, // Invites expire after 5 minutes
} as const;
