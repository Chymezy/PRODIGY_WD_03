import jwt from 'jsonwebtoken';
import { config } from '../config';
import { IUser } from '../models/User';

interface TokenPayload {
  sub: string;
  email: string;
  username: string;
  type?: 'access' | 'refresh';
}

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    { 
      sub: user.id,
      email: user.email,
      username: user.username,
      type: 'access'
    },
    config.jwtSecret,
    { expiresIn: config.accessTokenExpiry }
  );
};

export const generateRefreshToken = (user: IUser): string => {
  return jwt.sign(
    { 
      sub: user.id,
      email: user.email,
      username: user.username,
      type: 'refresh'
    },
    config.jwtSecret,
    { expiresIn: config.refreshTokenExpiry }
  );
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, config.jwtSecret) as TokenPayload;
  } catch (error) {
    return null;
  }
};
