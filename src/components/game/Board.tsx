import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { makeMove, setWinner } from '@/store/slices/gameSlice';
import Square from './Square';
import { checkWinner } from '@/utils/gameUtils';

const Board: React.FC = () => {
  const dispatch = useDispatch();
  const { board, currentPlayer, isGameOver, winner } = useSelector(
    (state: RootState) => state.game
  );

  const handleClick = (index: number) => {
    if (board[index] || isGameOver) return;

    dispatch(makeMove(index));
    
    const result = checkWinner(board);
    if (result && typeof result !== 'object') {
      dispatch(setWinner(result));
    }
  };

  const winningCombination = winner ? (checkWinner(board, true) as number[]) : [];

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="grid grid-cols-3 gap-3 aspect-square">
        {board.map((value, index) => (
          <Square
            key={index}
            value={value}
            onClick={() => handleClick(index)}
            isWinningSquare={Array.isArray(winningCombination) && winningCombination.includes(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
