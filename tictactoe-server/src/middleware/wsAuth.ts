import WebSocket from 'ws';
import { WsConnection, WsAuthRequest } from '../types';
import { verifyToken } from '../utils/jwt';
import { parse } from 'cookie';
import { inviteService } from '../services/inviteService';

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
    ws.username = decoded.username;
    ws.isAuthenticated = true;

    // Register the connection with inviteService
    inviteService.registerConnection(decoded.sub, ws);

    // Add cleanup on connection close
    ws.on('close', () => {
      if (ws.userId) {
        inviteService.removeConnection(ws.userId);
      }
    });

    console.log(`WebSocket authenticated for user: ${decoded.username}`);
    return true;
  } catch (error) {
    console.error('WebSocket authentication error:', error);
    return false;
  }
};
