import { Game, IGame } from '../models/Game';

export class ReplayService {
  async getGameReplay(gameId: string): Promise<IGame | null> {
    return Game.findById(gameId)
      .populate('playerX', 'username')
      .populate('playerO', 'username')
      .exec();
  }

  async getUserReplays(userId: string, limit: number = 10): Promise<IGame[]> {
    return Game.find({
      $or: [
        { playerX: userId },
        { playerO: userId }
      ],
      endTime: { $exists: true }
    })
    .sort({ endTime: -1 })
    .limit(limit)
    .populate('playerX', 'username')
    .populate('playerO', 'username')
    .exec();
  }

  async getReplaysByRoomId(roomId: string): Promise<IGame[]> {
    return Game.find({ roomId })
      .sort({ startTime: -1 })
      .populate('playerX', 'username')
      .populate('playerO', 'username')
      .exec();
  }
}

export const replayService = new ReplayService();
