import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { fetchAchievements } from '@/store/slices/achievementSlice';
import AchievementCard from './AchievementCard';
import { ACHIEVEMENTS } from '@/constants/achievements';

const AchievementList: React.FC = () => {
  const dispatch = useDispatch();
  const { achievements, loading, error } = useSelector(
    (state: RootState) => state.achievements
  );

  useEffect(() => {
    dispatch(fetchAchievements());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.values(ACHIEVEMENTS).map((achievement) => {
        const unlockedAchievement = achievements.find(a => a.id === achievement.id);
        return (
          <AchievementCard
            key={achievement.id}
            {...achievement}
            unlockedAt={unlockedAchievement?.unlockedAt}
          />
        );
      })}
    </div>
  );
};

export default AchievementList;
