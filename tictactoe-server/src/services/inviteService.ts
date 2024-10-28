import { GameInvite, IGameInvite } from '../models/GameInvite';
import { User, IUser } from '../models/User';
import { WsConnection } from '../types';
import { config } from '../config';
import WebSocket from 'ws';
import mongoose from 'mongoose';

interface PopulatedInvite extends Omit<IGameInvite, 'from'> {
  from: IUser;
}

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
    const populatedInvite = await savedInvite.populate<PopulatedInvite>('from', 'username');

    const targetWs = this.wsConnections.get(toUserId);
    if (targetWs?.readyState === WebSocket.OPEN) {
      targetWs.send(JSON.stringify({
        type: 'GAME_INVITE',
        payload: {
          id: populatedInvite._id,
          from: {
            id: fromUserId,
            username: populatedInvite.from.username
          },
          timestamp: populatedInvite.createdAt
        }
      }));
    }

    return populatedInvite;
  }

  async respondToInvite(inviteId: string, userId: string, accept: boolean): Promise<IGameInvite | null> {
    const invite = await GameInvite.findOne({
      _id: inviteId,
      to: new mongoose.Types.ObjectId(userId),
      status: 'pending'
    }).populate<PopulatedInvite>('from', 'username');

    if (!invite) {
      throw new Error('Invite not found or already processed');
    }

    invite.status = accept ? 'accepted' : 'declined';
    const updatedInvite = await invite.save();

    const senderWs = this.wsConnections.get(invite.from._id.toString());
    if (senderWs?.readyState === WebSocket.OPEN) {
      senderWs.send(JSON.stringify({
        type: 'INVITE_RESPONSE',
        payload: {
          inviteId: invite._id,
          accepted: accept,
          from: {
            id: invite.from._id,
            username: invite.from.username
          }
        }
      }));
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
