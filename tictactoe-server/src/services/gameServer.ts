import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { GameRoom, WsConnection, GameServerMessage } from '../types';
import { config } from '../config';
import { inviteService } from './inviteService';
import { gameStatsService } from './gameStatsService';

export class GameServer {
  private rooms: Map<string, GameRoom> = new Map();

  constructor() {
    setInterval(() => this.cleanupRooms(), config.roomCleanupInterval);
    setInterval(() => this.heartbeat(), config.wsHeartbeat);
  }

  private cleanupRooms() {
    const now = Date.now();
    for (const [roomId, room] of this.rooms.entries()) {
      if (room.gameState === 'waiting' && now - room.createdAt > config.roomTimeout) {
        this.rooms.delete(roomId);
      }
    }
  }

  private heartbeat() {
    for (const room of this.rooms.values()) {
      Object.values(room.players).forEach((player: WsConnection | undefined) => {
        if (!player) return;
        
        if (player.isAlive === false) {
          this.handleDisconnect(player);
          return;
        }

        player.isAlive = false;
        player.ping();
      });

      room.spectators.forEach((spectator: WsConnection) => {
        if (spectator.isAlive === false) {
          room.spectators.delete(spectator);
          return;
        }

        spectator.isAlive = false;
        spectator.ping();
      });
    }
  }

  handleConnection(ws: WsConnection) {
    console.log('New client connected');
    ws.isAlive = true;

    ws.on('message', async (message: WebSocket.RawData) => {
      try {
        const data = JSON.parse(message.toString());
        await this.handleMessage(ws, data);
      } catch (error) {
        console.error('Error handling message:', error);
        this.sendToClient(ws, {
          type: 'ERROR',
          payload: { message: 'Invalid message format' }
        });
      }
    });

    ws.on('close', () => {
      if (ws.userId) {
        inviteService.removeConnection(ws.userId);
      }
      this.handleDisconnect(ws);
    });

    ws.on('pong', () => {
      ws.isAlive = true;
    });
  }

  private handleDisconnect(ws: WsConnection) {
    if (!ws.roomId) return;

    const room = this.rooms.get(ws.roomId);
    if (!room) return;

    // Remove from spectators if spectating
    room.spectators.delete(ws);

    // Handle player disconnect
    if (room.players.X === ws || room.players.O === ws) {
      this.broadcastToRoom(room, {
        type: 'PLAYER_LEFT',
        payload: {
          player: ws.playerSymbol
        }
      });

      // End the game if it was in progress
      if (room.gameState === 'playing') {
        room.gameState = 'finished';
        this.broadcastToRoom(room, {
          type: 'GAME_OVER',
          payload: {
            winner: ws.playerSymbol === 'X' ? 'O' : 'X',
            board: room.board
          }
        });
      }

      // Clean up the room
      this.rooms.delete(ws.roomId);
    }

    // Clear connection state
    ws.roomId = undefined;
    ws.playerSymbol = undefined;
  }

  async createMatchedGame(playerX: WsConnection, playerO: WsConnection): Promise<GameRoom> {
    const roomId = uuidv4();
    const room: GameRoom = {
      id: roomId,
      players: { X: playerX, O: playerO },
      currentPlayer: 'X',
      board: Array(9).fill(null),
      gameState: 'playing',
      createdAt: Date.now(),
      spectators: new Set()
    };

    if (playerX.userId && playerO.userId) {
      const gameRecord = await gameStatsService.createGame(
        playerX.userId,
        playerO.userId,
        roomId
      );
      room.gameId = gameRecord.id;
    }

    this.rooms.set(roomId, room);
    playerX.roomId = roomId;
    playerX.playerSymbol = 'X';
    playerO.roomId = roomId;
    playerO.playerSymbol = 'O';

    // Notify both players
    [playerX, playerO].forEach(player => {
      this.sendToClient(player, {
        type: 'GAME_START',
        payload: {
          roomId,
          board: room.board,
          currentPlayer: room.currentPlayer,
          symbol: player.playerSymbol // Changed from playerSymbol to symbol
        }
      });
    });

    return room;
  }

  private async handleMessage(ws: WsConnection, message: any) {
    try {
      switch (message.type) {
        case 'SEND_INVITE':
          if (!ws.userId || !message.payload.targetUserId) {
            throw new Error('Invalid invite request');
          }
          await inviteService.createInvite(ws.userId, message.payload.targetUserId);
          break;

        case 'RESPOND_INVITE':
          if (!ws.userId || !message.payload.inviteId) {
            throw new Error('Invalid invite response');
          }
          const invite = await inviteService.respondToInvite(
            message.payload.inviteId,
            ws.userId,
            message.payload.accept
          );
          if (invite?.from && message.payload.accept) {
            const fromWs = inviteService.getConnection(invite.from.toString());
            if (fromWs) {
              await this.createMatchedGame(fromWs, ws);
            }
          }
          break;

        // ... rest of your message handling cases ...
      }
    } catch (error) {
      console.error('Error handling message:', error);
      this.sendToClient(ws, {
        type: 'ERROR',
        payload: { 
          message: error instanceof Error ? error.message : 'An error occurred'
        }
      });
    }
  }

  private sendToClient(ws: WsConnection, message: GameServerMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private broadcastToRoom(room: GameRoom, message: GameServerMessage) {
    const messageStr = JSON.stringify(message);
    
    Object.values(room.players).forEach(player => {
      if (player && player.readyState === WebSocket.OPEN) {
        player.send(messageStr);
      }
    });

    room.spectators.forEach(spectator => {
      if (spectator.readyState === WebSocket.OPEN) {
        spectator.send(messageStr);
      }
    });
  }
}
