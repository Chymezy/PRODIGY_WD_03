import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
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
