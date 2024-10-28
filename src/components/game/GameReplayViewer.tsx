import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Board from './Board';

interface ReplayMove {
  player: 'X' | 'O';
  position: number;
  timestamp: Date;
}

interface GameReplay {
  id: string;
  playerX: { username: string };
  playerO: { username: string };
  moves: ReplayMove[];
  winner: 'X' | 'O' | 'draw';
  startTime: Date;
  endTime: Date;
}

const GameReplayViewer: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [replay, setReplay] = useState<GameReplay | null>(null);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [board, setBoard] = useState<Array<'X' | 'O' | null>>(Array(9).fill(null));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchReplay = async () => {
      try {
        const response = await axios.get(`/api/replays/game/${gameId}`);
        setReplay(response.data);
        setBoard(Array(9).fill(null));
        setCurrentMoveIndex(0);
      } catch (err) {
        setError('Failed to load replay');
      } finally {
        setLoading(false);
      }
    };

    fetchReplay();
  }, [gameId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isPlaying && replay && currentMoveIndex < replay.moves.length) {
      timer = setTimeout(() => {
        playNextMove();
      }, 1000);
    } else if (currentMoveIndex >= (replay?.moves.length || 0)) {
      setIsPlaying(false);
    }

    return () => clearTimeout(timer);
  }, [isPlaying, currentMoveIndex, replay]);

  const playNextMove = () => {
    if (!replay || currentMoveIndex >= replay.moves.length) return;

    const newBoard = [...board];
    const move = replay.moves[currentMoveIndex];
    newBoard[move.position] = move.player;
    setBoard(newBoard);
    setCurrentMoveIndex(prev => prev + 1);
  };

  const playPreviousMove = () => {
    if (currentMoveIndex <= 0) return;

    const newBoard = [...board];
    const move = replay!.moves[currentMoveIndex - 1];
    newBoard[move.position] = null;
    setBoard(newBoard);
    setCurrentMoveIndex(prev => prev - 1);
  };

  const resetReplay = () => {
    setBoard(Array(9).fill(null));
    setCurrentMoveIndex(0);
    setIsPlaying(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
      </div>
    );
  }

  if (error || !replay) {
    return (
      <div className="text-center text-red-500 dark:text-red-400">
        {error || 'Failed to load replay'}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center mb-2">Game Replay</h2>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{replay.playerX.username} (X) vs {replay.playerO.username} (O)</span>
            <span>{new Date(replay.startTime).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Update Board usage */}
        <div className="board-container">
          <Board 
            board={board}  // Use board instead of squares
            onSquareClick={() => {}}
            disabled={true}
          />
        </div>

        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            onClick={() => playPreviousMove()}
            disabled={currentMoveIndex <= 0}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
          >
            ⏮️
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-lg bg-primary-light dark:bg-primary-dark text-white"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={() => playNextMove()}
            disabled={currentMoveIndex >= replay.moves.length}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
          >
            ⏭️
          </button>
          <button
            onClick={resetReplay}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            🔄
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Move {currentMoveIndex} of {replay.moves.length}
        </div>
      </div>
    </div>
  );
};

export default GameReplayViewer;
