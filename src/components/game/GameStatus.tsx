import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const GameStatus: React.FC = () => {
  const { winner, currentPlayer, isGameOver } = useSelector(
    (state: RootState) => state.game
  );

  return (
    <div className="text-center my-4">
      <div className={`
        text-xl sm:text-2xl font-bold
        ${winner === 'X' ? 'text-blue-600 dark:text-blue-400' : 
         winner === 'O' ? 'text-red-600 dark:text-red-400' : 
         'text-gray-800 dark:text-gray-200'}
      `}>
        {winner ? (
          <div className="animate-fade-in">
            {winner === 'draw' ? "It's a Draw!" : `Player ${winner} Wins!`}
          </div>
        ) : (
          <div className={`
            ${currentPlayer === 'X' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}
          `}>
            Player {currentPlayer}'s Turn
          </div>
        )}
      </div>
    </div>
  );
};

export default GameStatus;
