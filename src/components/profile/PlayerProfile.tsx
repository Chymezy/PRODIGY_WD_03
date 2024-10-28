import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchLeaderboard, fetchUserRank } from '@/store/slices/leaderboardSlice';
import { fetchAchievements } from '@/store/slices/achievementSlice';
import AchievementList from '../achievements/AchievementList';
import { LeaderboardEntry } from '@/types/websocket';

const PlayerProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { username, id } = useSelector((state: RootState) => state.auth);
  const { userRank } = useSelector((state: RootState) => state.leaderboard);
  const stats = useSelector((state: RootState) => 
    state.leaderboard.entries.find((e: LeaderboardEntry) => e.username === username)
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchLeaderboard());
      dispatch(fetchUserRank());
      dispatch(fetchAchievements());
    }
  }, [dispatch, id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-primary-light/10 dark:bg-primary-dark/10 rounded-full 
                flex items-center justify-center text-2xl font-bold text-primary-light dark:text-primary-dark">
                {username?.[0]?.toUpperCase()}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{username}</h1>
              <p className="text-gray-600 dark:text-gray-400">Rank #{userRank || '---'}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Rating</h3>
            <p className="text-3xl font-bold text-primary-light dark:text-primary-dark">
              {stats?.rating?.toLocaleString() || '1000'}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Win Rate</h3>
            <p className="text-3xl font-bold text-primary-light dark:text-primary-dark">
              {stats?.winRate ? `${stats.winRate.toFixed(1)}%` : '0.0%'}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Games Played</h3>
            <p className="text-3xl font-bold text-primary-light dark:text-primary-dark">
              {stats?.gamesPlayed?.toLocaleString() || '0'}
            </p>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Achievements</h2>
          <AchievementList />
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
