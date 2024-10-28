import { WebSocket } from 'ws';
import { IUser } from '../models/User';

export interface GameRoom {
  id: string;
  players: {
    X?: WsConnection;
    O?: WsConnection;
  };
  currentPlayer: 'X' | 'O';
  board: Array<'X' | 'O' | null>;
  gameState: 'waiting' | 'playing' | 'finished';
  createdAt: number;
  spectators: Set<WsConnection>;
  gameId?: string;
}

export interface GameMessage {
  type: string;
  payload: any;
}

export type WsConnection = WebSocket & {
  isAlive?: boolean;
  roomId?: string;
  playerSymbol?: 'X' | 'O';
  isAuthenticated?: boolean;
  userId?: string;
  username?: string;
};

// Add request type for WebSocket authentication
export interface WsAuthRequest {
  headers: {
    'sec-websocket-protocol'?: string;
    authorization?: string;
    cookie?: string;
  };
}

export interface PopulatedUser extends IUser {
  _id: string;
  username: string;
}

export interface GameInviteMessage {
  type: 'GAME_INVITE' | 'INVITE_RESPONSE' | 'INVITE_CANCELLED';
  payload: {
    id?: string;
    inviteId?: string;
    from?: {
      id: string;
      username?: string;
    };
    accepted?: boolean;
    timestamp?: Date;
  };
}

export interface GameStateMessage {
  type: 'GAME_STATE' | 'GAME_START' | 'GAME_OVER' | 'MOVE_MADE' | 'PLAYER_LEFT';
  payload: {
    board?: Array<'X' | 'O' | null>;
    currentPlayer?: 'X' | 'O';
    winner?: 'X' | 'O' | 'draw';
    position?: number;
    player?: 'X' | 'O';
    roomId?: string;
    gameState?: string;
    playerX?: string;
    playerO?: string;
  };
}

export type GameServerMessage = GameInviteMessage | GameStateMessage | {
  type: 'ERROR';
  payload: { message: string };
};
