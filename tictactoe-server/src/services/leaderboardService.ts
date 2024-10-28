import { User, IUser } from '../models/User';

export interface LeaderboardEntry {
  username: string;
  rating: number;
  wins: number;
  gamesPlayed: number;
  winRate: number;
}

export class LeaderboardService {
  async getTopPlayers(limit: number = 10): Promise<LeaderboardEntry[]> {
    const users = await User.find({
      gamesPlayed: { $gt: 0 }
    })
    .sort({ rating: -1 })
    .limit(limit)
    .select('username rating wins gamesPlayed');

    return users.map(user => ({
      username: user.username,
      rating: user.rating,
      wins: user.wins,
      gamesPlayed: user.gamesPlayed,
      winRate: (user.wins / user.gamesPlayed) * 100
    }));
  }

  async getUserRank(userId: string): Promise<number> {
    const user = await User.findById(userId);
    if (!user) return -1;

    const higherRankedCount = await User.countDocuments({
      rating: { $gt: user.rating }
    });

    return higherRankedCount + 1;
  }

  async getPlayerStats(userId: string): Promise<LeaderboardEntry | null> {
    const user = await User.findById(userId);
    if (!user) return null;

    return {
      username: user.username,
      rating: user.rating,
      wins: user.wins,
      gamesPlayed: user.gamesPlayed,
      winRate: (user.wins / user.gamesPlayed) * 100
    };
  }
}

export const leaderboardService = new LeaderboardService();
