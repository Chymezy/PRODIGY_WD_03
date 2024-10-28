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
        className="w-full sm:w-auto px-6 py-3 bg-primary-light dark:bg-primary-dark 
          text-white rounded-lg hover:opacity-90 transition-all duration-200
          text-sm sm:text-base font-medium shadow-md hover:shadow-lg"
      >
        New Game
      </button>
      
      <div className="flex gap-2 w-full sm:w-auto">
        <button
          onClick={() => dispatch(setGameMode('PVP'))}
          className={`flex-1 sm:flex-none px-4 py-3 rounded-lg text-sm sm:text-base font-medium
            transition-all duration-200 shadow-md hover:shadow-lg
            ${gameMode === 'PVP'
              ? 'bg-primary-light dark:bg-primary-dark text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            } hover:opacity-90`}
        >
          vs Player
        </button>
        
        <button
          onClick={() => dispatch(setGameMode('AI'))}
          className={`flex-1 sm:flex-none px-4 py-3 rounded-lg text-sm sm:text-base font-medium
            transition-all duration-200 shadow-md hover:shadow-lg
            ${gameMode === 'AI'
              ? 'bg-primary-light dark:bg-primary-dark text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            } hover:opacity-90`}
        >
          vs AI
        </button>
      </div>
    </div>
  );
};

export default GameControls;
