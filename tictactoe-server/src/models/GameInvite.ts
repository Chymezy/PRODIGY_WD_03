import mongoose, { Schema, Document, PopulatedDoc } from 'mongoose';
import { IUser } from './User';

export interface IGameInvite extends Document {
  from: PopulatedDoc<IUser & Document>;
  to: PopulatedDoc<IUser & Document>;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  roomId?: string;
}

const GameInviteSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'expired'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  roomId: { type: String }
}, {
  timestamps: true
});

// Add index for expiration
GameInviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Add compound index for user queries
GameInviteSchema.index({ to: 1, status: 1 });
GameInviteSchema.index({ from: 1, status: 1 });

export const GameInvite = mongoose.model<IGameInvite>('GameInvite', GameInviteSchema);
