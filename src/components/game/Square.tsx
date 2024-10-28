import React from 'react';
import { Player } from '@/types';

interface SquareProps {
  value: Player;
  onClick: () => void;
  isWinningSquare?: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onClick, isWinningSquare = false }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full aspect-square
        text-4xl sm:text-5xl md:text-6xl lg:text-7xl
        font-bold
        border-2 border-gray-300 dark:border-gray-600
        rounded-lg
        transition-all
        duration-200
        flex
        items-center
        justify-center
        shadow-md
        hover:shadow-lg
        ${isWinningSquare 
          ? 'bg-primary-light/20 dark:bg-primary-dark/20 border-primary-light dark:border-primary-dark' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
        ${value === 'X' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}
      `}
      disabled={!!value}
      aria-label={`Square ${value || 'empty'}`}
    >
      {value && (
        <span className="transform transition-all duration-200 hover:scale-105">
          {value}
        </span>
      )}
    </button>
  );
};

export default Square;
