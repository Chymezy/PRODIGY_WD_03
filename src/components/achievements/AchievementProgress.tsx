import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface AchievementProgressProps {
  achievementId: string;
  currentValue: number;
  targetValue: number;
}

const AchievementProgress: React.FC<AchievementProgressProps> = ({
  achievementId,
  currentValue,
  targetValue
}) => {
  const achievement = useSelector((state: RootState) => 
    state.achievements.achievements.find(a => a.id === achievementId)
  );

  const progress = Math.min((currentValue / targetValue) * 100, 100);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {achievement ? 'Unlocked!' : `${currentValue}/${targetValue}`}
        </span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {progress.toFixed(0)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${
            achievement 
              ? 'bg-green-600 dark:bg-green-500'
              : 'bg-primary-light dark:bg-primary-dark'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default AchievementProgress;
