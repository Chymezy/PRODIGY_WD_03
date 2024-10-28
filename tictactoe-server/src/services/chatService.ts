import { Chat, IChat } from '../models/Chat';
import { IUser } from '../models/User';

export class ChatService {
  async createChat(roomId: string): Promise<IChat> {
    const chat = new Chat({ roomId, messages: [] });
    return chat.save();
  }

  async addMessage(roomId: string, userId: IUser['_id'], username: string, content: string): Promise<void> {
    await Chat.findOneAndUpdate(
      { roomId },
      {
        $push: {
          messages: {
            userId,
            username,
            content,
            timestamp: new Date()
          }
        }
      },
      { upsert: true }
    );
  }

  async getRoomMessages(roomId: string, limit: number = 50): Promise<IChat | null> {
    return Chat.findOne({ roomId })
      .slice('messages', -limit)
      .exec();
  }
}

export const chatService = new ChatService();
