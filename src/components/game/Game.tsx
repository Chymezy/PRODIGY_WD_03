import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import Board from './Board';
import GameStatus from './GameStatus';
import GameControls from './GameControls';
import { makeMove, setGameMode, setWinner } from '@/store/slices/gameSlice';
import { wsService } from '@/services/websocketService';
import { GameMessage } from '@/types';

const WEBSOCKET_URL = 'ws://your-backend-url/game';

const Game: React.FC = () => {
  const dispatch = useDispatch();
  const { gameMode, currentPlayer, board, roomId, playerSymbol } = useSelector(
    (state: RootState) => state.game
  );
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (gameMode === 'ONLINE' && !isConnecting) {
      setIsConnecting(true);
      wsService.connect(WEBSOCKET_URL)
        .then(() => {
          setIsConnecting(false);
          setError(null);
        })
        .catch((err) => {
          setIsConnecting(false);
          setError('Failed to connect to game server');
          console.error(err);
        });
    }

    return () => {
      if (gameMode === 'ONLINE') {
        wsService.disconnect();
      }
    };
  }, [gameMode]);

  useEffect(() => {
    const handleMessage = (message: GameMessage) => {
      switch (message.type) {
        case 'MOVE':
          dispatch(makeMove(message.payload.position));
          break;
        case 'GAME_STATE':
          // Handle updated game state
          break;
        case 'ERROR':
          setError(message.payload.message);
          break;
      }
    };

    wsService.addMessageHandler(handleMessage);
    return () => wsService.removeMessageHandler(handleMessage);
  }, [dispatch]);

  const createRoom = () => {
    wsService.send({
      type: 'CREATE_ROOM',
      payload: {}
    });
  };

  const joinRoom = (roomId: string) => {
    wsService.send({
      type: 'JOIN_ROOM',
      payload: { roomId }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8">
        Tic Tac Toe {gameMode === 'AI' ? 'vs AI' : gameMode === 'ONLINE' ? 'Online' : 'vs Player'}
      </h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {gameMode === 'ONLINE' && !roomId && (
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={createRoom}
              className="px-6 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-lg
                hover:opacity-90 transition-all duration-200"
            >
              Create Room
            </button>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Room Code"
                className="px-4 py-2 border rounded-lg dark:bg-gray-700"
              />
              <button
                onClick={() => {/* Handle join room */}}
                className="px-6 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg
                  hover:opacity-90 transition-all duration-200"
              >
                Join
              </button>
            </div>
          </div>
        )}

        {(gameMode !== 'ONLINE' || roomId) && (
          <>
            <GameStatus />
            <Board />
            <GameControls />
          </>
        )}

        {roomId && (
          <div className="mt-4 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Room Code: <span className="font-mono font-bold">{roomId}</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Share this code with your friend to play together
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
