import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { wsService } from '@/services/websocketService';
import { makeMove, setGameState } from '@/store/slices/gameSlice';
import { RootState, AppDispatch } from '@/store';
import Board from './Board';
import GameStatus from './GameStatus';
import GameControls from './GameControls';
import { GameMessage } from '@/types/index';

const Game: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { board, currentPlayer, winner, gameState, playerSymbol } = useSelector(
    (state: RootState) => state.game
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const handleGameMessage = (message: GameMessage) => {
      try {
        switch (message.type) {
          case 'MOVE':
            if (typeof message.payload.position === 'number') {
              dispatch(makeMove(message.payload.position));
            }
            break;
          case 'GAME_STATE':
            if (message.payload.board && message.payload.currentPlayer) {
              dispatch(setGameState({
                board: message.payload.board,
                currentPlayer: message.payload.currentPlayer,
                winner: message.payload.winner || null,
                gameState: message.payload.gameState || 'playing'
              }));
            }
            break;
          case 'ERROR':
            if (message.payload.message) {
              setError(message.payload.message);
            }
            break;
        }
      } catch (err) {
        console.error('Error handling game message:', err);
        setError('Error handling game message');
      }
    };

    wsService.addMessageHandler(handleGameMessage);

    return () => {
      wsService.removeMessageHandler(handleGameMessage);
    };
  }, [dispatch, roomId]);

  const handleSquareClick = (position: number) => {
    if (gameState !== 'playing' || currentPlayer !== playerSymbol || winner) {
      return;
    }

    wsService.send({
      type: 'MOVE',
      payload: { position }
    });
  };

  if (error) {
    return (
      <div className="text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <GameStatus />
        <Board 
          board={board}
          onSquareClick={handleSquareClick}
          disabled={gameState !== 'playing' || currentPlayer !== playerSymbol}
        />
        <GameControls />
      </div>
    </div>
  );
};

export default Game;
