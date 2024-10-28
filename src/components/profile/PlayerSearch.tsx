import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface PlayerSearchResult {
  id: string;
  username: string;
  rating: number;
}

interface PlayerSearchProps {
  onSelect: (player: { id: string; username: string }) => void;
  selectedPlayer: { id: string; username: string } | null;
}

const PlayerSearch: React.FC<PlayerSearchProps> = ({ onSelect, selectedPlayer }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlayerSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const searchPlayers = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/players/search?q=${searchQuery}`);
      setResults(response.data);
    } catch (err) {
      setError('Failed to search players');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    searchPlayers(value);
  };

  const viewProfile = (playerId: string) => {
    navigate(`/profile/${playerId}`);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search players..."
          className="w-full px-4 py-2 border rounded-lg
            dark:bg-gray-800 dark:border-gray-700
            focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
        />
        {loading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-light dark:border-primary-dark" />
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 text-red-500 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          {results.map((player) => (
            <button
              key={player.id}
              onClick={() => {
                onSelect({ id: player.id, username: player.username });
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700
                first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{player.username}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Rating: {player.rating}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerSearch;
