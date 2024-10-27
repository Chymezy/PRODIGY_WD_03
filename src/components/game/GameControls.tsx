import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetGame, setGameMode } from '@/store/slices/gameSlice';
import { RootState } from '@/store';

const GameControls: React.FC = () => {
  const dispatch = useDispatch();
  const { gameMode } = useSelector((state: RootState) => state.game);

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center my-6">
      <button
        onClick={() => dispatch(resetGame())}
        className="px-6 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg
          hover:opacity-90 transition-opacity duration-200
          text-sm sm:text-base"
      >
        New Game
      </button>
      
      <div className="flex gap-2">
        <button
          onClick={() => dispatch(setGameMode('PVP'))}
          className={`px-4 py-2 rounded-lg text-sm sm:text-base
            ${gameMode === 'PVP'
              ? 'bg-primary-light dark:bg-primary-dark text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            } hover:opacity-90 transition-all duration-200`}
        >
          Player vs Player
        </button>
        
        <button
          onClick={() => dispatch(setGameMode('AI'))}
          className={`px-4 py-2 rounded-lg text-sm sm:text-base
            ${gameMode === 'AI'
              ? 'bg-primary-light dark:bg-primary-dark text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            } hover:opacity-90 transition-all duration-200`}
        >
          vs AI
        </button>
      </div>
    </div>
  );
};

export default GameControls;
