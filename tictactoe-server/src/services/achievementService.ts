import { User, IUser, Achievement } from '../models/User';

interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
}

export const ACHIEVEMENTS: Record<string, AchievementDefinition> = {
  FIRST_WIN: {
    id: 'FIRST_WIN',
    name: 'First Victory',
    description: 'Win your first game'
  },
  WINNING_STREAK: {
    id: 'WINNING_STREAK',
    name: 'On Fire',
    description: 'Win 5 games in a row'
  },
  MASTER_PLAYER: {
    id: 'MASTER_PLAYER',
    name: 'Master Player',
    description: 'Reach 1500 rating points'
  },
  VETERAN: {
    id: 'VETERAN',
    name: 'Veteran',
    description: 'Play 100 games'
  },
  PERFECT_GAME: {
    id: 'PERFECT_GAME',
    name: 'Perfect Game',
    description: 'Win a game without letting your opponent make a move'
  }
};

export class AchievementService {
  async checkAndAwardAchievements(userId: string): Promise<Achievement[]> {
    const user = await User.findById(userId);
    if (!user) return [];

    const newAchievements: Achievement[] = [];

    // Check each achievement condition
    if (user.wins === 1) {
      const achievement = await this.awardAchievement(user, ACHIEVEMENTS.FIRST_WIN);
      if (achievement) newAchievements.push(achievement);
    }

    if (user.rating >= 1500) {
      const hasAchievement = user.achievements.some(a => a.id === ACHIEVEMENTS.MASTER_PLAYER.id);
      if (!hasAchievement) {
        const achievement = await this.awardAchievement(user, ACHIEVEMENTS.MASTER_PLAYER);
        if (achievement) newAchievements.push(achievement);
      }
    }

    if (user.gamesPlayed >= 100) {
      const hasAchievement = user.achievements.some(a => a.id === ACHIEVEMENTS.VETERAN.id);
      if (!hasAchievement) {
        const achievement = await this.awardAchievement(user, ACHIEVEMENTS.VETERAN);
        if (achievement) newAchievements.push(achievement);
      }
    }

    return newAchievements;
  }

  private async awardAchievement(
    user: IUser, 
    achievementDef: AchievementDefinition
  ): Promise<Achievement | null> {
    try {
      const achievement: Achievement = {
        id: achievementDef.id,
        name: achievementDef.name,
        description: achievementDef.description,
        unlockedAt: new Date()
      };

      await User.findByIdAndUpdate(user.id, {
        $push: { achievements: achievement }
      });

      return achievement;
    } catch (error) {
      console.error('Error awarding achievement:', error);
      return null;
    }
  }

  async checkPerfectGame(userId: string, gameId: string): Promise<Achievement | null> {
    // TODO: Implement perfect game check
    return null;
  }

  async getUnlockedAchievements(userId: string): Promise<Achievement[]> {
    const user = await User.findById(userId);
    return user?.achievements || [];
  }
}

export const achievementService = new AchievementService();
