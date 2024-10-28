import React from 'react';

interface AchievementCardProps {
  id: string;
  name: string;
  description: string;
  unlockedAt?: Date;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ name, description, unlockedAt }) => {
  return (
    <div className={`p-4 rounded-lg shadow-md transition-all duration-200 
      ${unlockedAt 
        ? 'bg-primary-light/10 dark:bg-primary-dark/10 border-primary-light dark:border-primary-dark' 
        : 'bg-gray-100 dark:bg-gray-800 opacity-50'}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{name}</h3>
        {unlockedAt && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(unlockedAt).toLocaleDateString()}
          </span>
        )}
      </div>
      <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

export default AchievementCard;
