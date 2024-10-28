import { User, IUser } from '../models/User';

export class RatingService {
  private readonly K_FACTOR = 32;

  calculateNewRatings(winner: IUser, loser: IUser): { winnerNewRating: number, loserNewRating: number } {
    const expectedScoreWinner = this.getExpectedScore(winner.rating, loser.rating);
    const expectedScoreLoser = this.getExpectedScore(loser.rating, winner.rating);

    const winnerNewRating = Math.round(winner.rating + this.K_FACTOR * (1 - expectedScoreWinner));
    const loserNewRating = Math.round(loser.rating + this.K_FACTOR * (0 - expectedScoreLoser));

    return { winnerNewRating, loserNewRating };
  }

  private getExpectedScore(ratingA: number, ratingB: number): number {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  }

  async updateRatings(winnerId: string, loserId: string): Promise<void> {
    const [winner, loser] = await Promise.all([
      User.findById(winnerId),
      User.findById(loserId)
    ]);

    if (!winner || !loser) return;

    const { winnerNewRating, loserNewRating } = this.calculateNewRatings(winner, loser);

    await Promise.all([
      User.findByIdAndUpdate(winnerId, {
        $set: { rating: winnerNewRating },
        $inc: { gamesPlayed: 1, wins: 1 }
      }),
      User.findByIdAndUpdate(loserId, {
        $set: { rating: loserNewRating },
        $inc: { gamesPlayed: 1, losses: 1 }
      })
    ]);
  }

  async handleDraw(player1Id: string, player2Id: string): Promise<void> {
    await User.updateMany(
      { _id: { $in: [player1Id, player2Id] } },
      { $inc: { gamesPlayed: 1, draws: 1 } }
    );
  }
}

export const ratingService = new RatingService();
