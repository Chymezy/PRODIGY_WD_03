import React from 'react';
import Square from './Square';

interface BoardProps {
  board: Array<'X' | 'O' | null>;
  onSquareClick: (index: number) => void;
  disabled?: boolean;
}

interface SquareProps {
  value: 'X' | 'O' | null;
  onClick: () => void;
}

const Board: React.FC<BoardProps> = ({ board, onSquareClick, disabled = false }) => {
  return (
    <div className="grid grid-cols-3 gap-2 max-w-[300px] mx-auto">
      {board.map((value, i) => (
        <Square
          key={i}
          value={value}
          onClick={() => !disabled && onSquareClick(i)}
        />
      ))}
    </div>
  );
};

export default Board;
