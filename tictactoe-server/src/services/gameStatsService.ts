import { Game, IGame } from '../models/Game';
import { IUser } from '../models/User';

export class GameStatsService {
  async createGame(playerX: IUser['_id'], playerO: IUser['_id'], roomId: string): Promise<IGame> {
    const game = new Game({
      playerX,
      playerO,
      roomId,
      startTime: new Date()
    });
    return game.save();
  }

  async recordMove(gameId: string, player: 'X' | 'O', position: number): Promise<void> {
    await Game.findByIdAndUpdate(gameId, {
      $push: {
        moves: {
          player,
          position,
          timestamp: new Date()
        }
      }
    });
  }

  async endGame(gameId: string, winner: 'X' | 'O' | 'draw'): Promise<void> {
    await Game.findByIdAndUpdate(gameId, {
      winner,
      endTime: new Date()
    });
  }

  async getPlayerStats(userId: string) {
    const stats = await Game.aggregate([
      {
        $match: {
          $or: [
            { playerX: userId },
            { playerO: userId }
          ],
          endTime: { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          totalGames: { $sum: 1 },
          wins: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $and: [{ $eq: ['$winner', 'X'] }, { $eq: ['$playerX', userId] }] },
                    { $and: [{ $eq: ['$winner', 'O'] }, { $eq: ['$playerO', userId] }] }
                  ]
                },
                1,
                0
              ]
            }
          },
          draws: {
            $sum: {
              $cond: [{ $eq: ['$winner', 'draw'] }, 1, 0]
            }
          }
        }
      }
    ]);

    return stats[0] || { totalGames: 0, wins: 0, draws: 0 };
  }

  async getRecentGames(userId: string, limit: number = 10) {
    return Game.find({
      $or: [
        { playerX: userId },
        { playerO: userId }
      ]
    })
    .sort({ endTime: -1 })
    .limit(limit)
    .populate('playerX', 'username')
    .populate('playerO', 'username');
  }
}

export const gameStatsService = new GameStatsService();
