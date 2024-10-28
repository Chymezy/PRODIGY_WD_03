import WebSocket from 'ws';
import { WsConnection, WsAuthRequest } from '../types';
import { verifyToken } from '../utils/jwt';
import { parse } from 'cookie';

export const wsAuth = (ws: WsConnection, req: WsAuthRequest): boolean => {
  try {
    // Get token from cookie
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token;

    if (!token) {
      return false;
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return false;
    }

    // Add user info to WebSocket connection
    ws.userId = decoded.sub;
    ws.username = decoded.username; // Add this line to set the username
    ws.isAuthenticated = true;
    return true;
  } catch (error) {
    console.error('WebSocket authentication error:', error);
    return false;
  }
};
