import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '@/store';

interface GameHistoryEntry {
  id: string;
  playerX: { username: string };
  playerO: { username: string };
  winner: 'X' | 'O' | 'draw';
  startTime: string;
  endTime: string;
}

const GameHistory: React.FC = () => {
  const [games, setGames] = useState<GameHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = useSelector((state: RootState) => state.auth.id);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('/api/replays/user');
        setGames(response.data);
      } catch (err) {
        setError('Failed to load game history');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

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
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Recent Games</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Opponent
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Result
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Duration
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {games.map((game) => {
              const isPlayerX = game.playerX.username === userId;
              const opponent = isPlayerX ? game.playerO.username : game.playerX.username;
              const result = game.winner === 'draw' 
                ? 'Draw'
                : (game.winner === (isPlayerX ? 'X' : 'O') ? 'Won' : 'Lost');
              const duration = new Date(game.endTime).getTime() - new Date(game.startTime).getTime();
              const minutes = Math.floor(duration / 60000);

              return (
                <tr key={game.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {new Date(game.startTime).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {opponent}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium
                    ${result === 'Won' ? 'text-green-600 dark:text-green-400' :
                      result === 'Lost' ? 'text-red-600 dark:text-red-400' :
                      'text-gray-600 dark:text-gray-400'}`}>
                    {result}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {minutes} min
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GameHistory;
