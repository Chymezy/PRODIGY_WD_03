import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IChat extends Document {
  roomId: string;
  messages: Array<{
    userId: IUser['_id'];
    username: string;
    content: string;
    timestamp: Date;
  }>;
}

const ChatSchema = new Schema({
  roomId: { type: String, required: true, unique: true },
  messages: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

export const Chat = mongoose.model<IChat>('Chat', ChatSchema);
