import { Player } from '@/types';

const WINNING_COMBINATIONS = [
  [0, 1, 2], // Rows
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // Columns
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // Diagonals
  [2, 4, 6],
];

export const checkWinner = (
  board: Player[],
  returnCombination: boolean = false
): Player | 'draw' | number[] | null => {
  // Check for winner
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return returnCombination ? [a, b, c] : board[a];
    }
  }

  // Check for draw
  if (!board.includes(null)) {
    return 'draw';
  }

  return null;
};

export const getAIMove = (board: Player[]): number => {
  // Simple AI: Look for winning move
  const aiPlayer: Player = 'O';
  const humanPlayer: Player = 'X';

  // Try to win
  const winningMove = findWinningMove(board, aiPlayer);
  if (winningMove !== -1) return winningMove;

  // Block player from winning
  const blockingMove = findWinningMove(board, humanPlayer);
  if (blockingMove !== -1) return blockingMove;

  // Take center if available
  if (board[4] === null) return 4;

  // Take any available corner
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(i => board[i] === null);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }

  // Take any available side
  const sides = [1, 3, 5, 7];
  const availableSides = sides.filter(i => board[i] === null);
  if (availableSides.length > 0) {
    return availableSides[Math.floor(Math.random() * availableSides.length)];
  }

  // Take any available space
  const availableSpaces = board.map((_, i) => i).filter(i => board[i] === null);
  return availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
};

const findWinningMove = (board: Player[], player: Player): number => {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      const boardCopy = [...board];
      boardCopy[i] = player;
      if (checkWinner(boardCopy) === player) {
        return i;
      }
    }
  }
  return -1;
};
