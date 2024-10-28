import { Request, Response, NextFunction } from 'express';
import { verifyToken, generateToken } from '../utils/jwt';
import { config } from '../config';
import { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

interface TokenPayload {
  sub: string;
  email: string;
  username: string;
}

// Create a minimal user object that matches IUser interface
const createMinimalUser = (data: TokenPayload): Partial<IUser> => ({
  _id: data.sub,
  email: data.email,
  username: data.username,
  passwordHash: '',
  rating: 1000,
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  achievements: []
});

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = verifyToken(token) as TokenPayload | null;
    if (!decoded) {
      // Try to use refresh token if available
      if (refreshToken) {
        const refreshDecoded = verifyToken(refreshToken) as TokenPayload | null;
        if (refreshDecoded) {
          // Generate new access token using minimal user object
          const minimalUser = createMinimalUser(refreshDecoded);
          const newToken = generateToken(minimalUser as IUser);

          res.cookie('token', newToken, { 
            ...config.cookie,
            maxAge: 15 * 60 * 1000 // 15 minutes for access token
          });

          req.user = {
            id: refreshDecoded.sub,
            email: refreshDecoded.email,
            username: refreshDecoded.username
          };
          return next();
        }
      }
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      username: decoded.username
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

export const rateLimiter = (windowMs: number, maxRequests: number) => {
  const requests = new Map<string, number[]>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const ipAddress = (req.ip || req.socket.remoteAddress || 'unknown') as string;

    if (!requests.has(ipAddress)) {
      requests.set(ipAddress, [now]);
      return next();
    }

    const userRequests = requests.get(ipAddress) || [];
    const windowStart = now - windowMs;

    // Filter out old requests
    const recentRequests = userRequests.filter(time => time > windowStart);
    requests.set(ipAddress, recentRequests);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({ 
        message: 'Too many requests, please try again later' 
      });
    }

    recentRequests.push(now);
    next();
  };
};
