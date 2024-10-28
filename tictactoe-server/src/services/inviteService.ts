import { GameInvite, IGameInvite } from '../models/GameInvite';
import { User } from '../models/User';
import { WsConnection, GameInviteMessage } from '../types';
import { config } from '../config';
import WebSocket from 'ws';
import mongoose, { Types } from 'mongoose';

export class InviteService {
  private wsConnections: Map<string, WsConnection> = new Map();

  registerConnection(userId: string, ws: WsConnection) {
    this.wsConnections.set(userId, ws);
  }

  removeConnection(userId: string) {
    this.wsConnections.delete(userId);
  }

  getConnection(userId: string): WsConnection | undefined {
    return this.wsConnections.get(userId);
  }

  private sendToClient(ws: WsConnection, message: GameInviteMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  async createInvite(fromUserId: string, toUserId: string): Promise<IGameInvite> {
    const existingInvite = await GameInvite.findOne({
      from: new mongoose.Types.ObjectId(fromUserId),
      to: new mongoose.Types.ObjectId(toUserId),
      status: 'pending'
    });

    if (existingInvite) {
      throw new Error('Invite already sent');
    }

    const invite = new GameInvite({
      from: fromUserId,
      to: toUserId,
      expiresAt: new Date(Date.now() + config.inviteTimeout)
    });

    const savedInvite = await invite.save();
    if (!savedInvite._id) {
      throw new Error('Failed to create invite');
    }

    const fromUser = await User.findById(fromUserId).select('username');

    const targetWs = this.wsConnections.get(toUserId);
    if (targetWs?.readyState === WebSocket.OPEN) {
      this.sendToClient(targetWs, {
        type: 'GAME_INVITE',
        payload: {
          inviteId: savedInvite._id.toString(),
          from: {
            id: fromUserId,
            username: fromUser?.username
          }
        }
      });
    }

    return savedInvite;
  }

  async respondToInvite(inviteId: string, userId: string, accept: boolean): Promise<IGameInvite | null> {
    const invite = await GameInvite.findOne({
      _id: inviteId,
      to: new mongoose.Types.ObjectId(userId),
      status: 'pending'
    });

    if (!invite || !invite.from) {
      throw new Error('Invite not found or already processed');
    }

    invite.status = accept ? 'accepted' : 'declined';
    const updatedInvite = await invite.save();

    const senderWs = this.wsConnections.get(invite.from.toString());
    if (senderWs?.readyState === WebSocket.OPEN) {
      this.sendToClient(senderWs, {
        type: 'INVITE_RESPONSE',
        payload: {
          inviteId: (invite._id as Types.ObjectId).toString(),
          accepted: accept
        }
      });
    }

    return updatedInvite;
  }

  async setInviteRoom(inviteId: string, roomId: string): Promise<void> {
    await GameInvite.findByIdAndUpdate(inviteId, {
      roomId,
      status: 'accepted'
    });
  }

  async cleanupExpiredInvites(): Promise<void> {
    await GameInvite.updateMany(
      {
        status: 'pending',
        expiresAt: { $lte: new Date() }
      },
      {
        $set: { status: 'expired' }
      }
    );
  }
}

export const inviteService = new InviteService();
