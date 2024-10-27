import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { makeMove } from '@/store/slices/gameSlice';
import Board from './Board';
import GameStatus from './GameStatus';
import GameControls from './GameControls';
import { getAIMove } from '@/utils/gameUtils';

const Game: React.FC = () => {
  const dispatch = useDispatch();
  const { gameMode, currentPlayer, isGameOver, board } = useSelector(
    (state: RootState) => state.game
  );

  useEffect(() => {
    if (gameMode === 'AI' && currentPlayer === 'O' && !isGameOver) {
      const timer = setTimeout(() => {
        const aiMove = getAIMove(board);
        dispatch(makeMove(aiMove));
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode, isGameOver, board, dispatch]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8">
          Tic Tac Toe
        </h1>
        <GameStatus />
        <Board />
        <GameControls />
      </div>
    </div>
  );
};

export default Game;
