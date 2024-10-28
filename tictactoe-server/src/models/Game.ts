import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IGame extends Document {
  playerX: IUser['_id'];
  playerO: IUser['_id'];
  winner: 'X' | 'O' | 'draw' | null;
  moves: Array<{
    player: 'X' | 'O';
    position: number;
    timestamp: Date;
  }>;
  startTime: Date;
  endTime?: Date;
  roomId: string;
}

const GameSchema = new Schema({
  playerX: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  playerO: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  winner: { type: String, enum: ['X', 'O', 'draw', null], default: null },
  moves: [{
    player: { type: String, enum: ['X', 'O'], required: true },
    position: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  roomId: { type: String, required: true }
}, {
  timestamps: true
});

export const Game = mongoose.model<IGame>('Game', GameSchema);
