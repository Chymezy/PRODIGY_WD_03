import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface StatsDisplayProps {
  compact?: boolean;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ compact = false }) => {
  const stats = useSelector((state: RootState) => {
    const user = state.auth;
    return state.leaderboard.entries.find(e => e.username === user.username);
  });

  if (!stats) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <span>Rating: {stats.rating}</span>
        <span>Win Rate: {stats.winRate.toFixed(1)}%</span>
        <span>Games: {stats.gamesPlayed}</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Rating</h3>
        <p className="mt-1 text-2xl font-semibold text-primary-light dark:text-primary-dark">
          {stats.rating}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Win Rate</h3>
        <p className="mt-1 text-2xl font-semibold text-primary-light dark:text-primary-dark">
          {stats.winRate.toFixed(1)}%
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Games Played</h3>
        <p className="mt-1 text-2xl font-semibold text-primary-light dark:text-primary-dark">
          {stats.gamesPlayed}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Rank</h3>
        <p className="mt-1 text-2xl font-semibold text-primary-light dark:text-primary-dark">
          #{stats.rank || '?'}
        </p>
      </div>
    </div>
  );
};

export default StatsDisplay;
