import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { fetchLeaderboard, fetchUserRank } from '@/store/slices/leaderboardSlice';

const LeaderboardTable: React.FC = () => {
  const dispatch = useDispatch();
  const { entries, userRank, loading, error } = useSelector(
    (state: RootState) => state.leaderboard
  );
  const userId = useSelector((state: RootState) => state.auth.id);

  useEffect(() => {
    dispatch(fetchLeaderboard());
    if (userId) {
      dispatch(fetchUserRank());
    }
  }, [dispatch, userId]);

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
    <div className="overflow-x-auto">
      {userId && (
        <div className="mb-4 p-4 bg-primary-light/10 dark:bg-primary-dark/10 rounded-lg">
          <p className="text-center font-semibold">
            Your Rank: #{userRank}
          </p>
        </div>
      )}
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Rank
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Player
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Rating
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Win Rate
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Games
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {entries.map((entry, index) => (
            <tr key={entry.username} className={entry.username === userId ? 'bg-primary-light/5 dark:bg-primary-dark/5' : ''}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                #{index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {entry.username}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {entry.rating}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {entry.winRate.toFixed(1)}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {entry.gamesPlayed}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
