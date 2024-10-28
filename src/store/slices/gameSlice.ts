import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState } from '@/types';
import { checkWinner } from '@/utils/gameUtils';

const initialState: GameState = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
  winner: null,
  gameMode: 'AI',
  isGameOver: false,
  roomId: undefined,
  playerSymbol: null,
  gameState: 'waiting'
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    makeMove: (state, action: PayloadAction<number>) => {
      const position = action.payload;
      if (state.board[position] === null && !state.isGameOver) {
        // Make the move
        state.board[position] = state.currentPlayer;
        
        // Check for winner
        const result = checkWinner(state.board);
        if (typeof result === 'string') {
          // Handle 'X', 'O', or 'draw'
          state.winner = result;
          state.isGameOver = true;
          state.gameState = 'finished';
        } else if (Array.isArray(result)) {
          // Handle winning combination array
          state.winner = state.currentPlayer;
          state.isGameOver = true;
          state.gameState = 'finished';
        } else if (!state.board.includes(null)) {
          // Handle draw when board is full
          state.winner = 'draw';
          state.isGameOver = true;
          state.gameState = 'finished';
        } else {
          // Switch players if game continues
          state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
        }
      }
    },
    setGameState: (state, action: PayloadAction<Partial<GameState>>) => {
      return { ...state, ...action.payload };
    },
    resetGame: (state) => {
      // Reset game but keep the game mode
      const currentMode = state.gameMode;
      Object.assign(state, { ...initialState, gameMode: currentMode });
      state.board = Array(9).fill(null);
      state.currentPlayer = 'X';
      state.winner = null;
      state.isGameOver = false;
      state.gameState = 'playing';
    },
    setGameMode: (state, action: PayloadAction<'AI' | 'PVP' | 'ONLINE'>) => {
      state.gameMode = action.payload;
      // Reset game when changing modes
      state.board = Array(9).fill(null);
      state.currentPlayer = 'X';
      state.winner = null;
      state.isGameOver = false;
      state.gameState = 'playing';
    }
  }
});

export const { makeMove, setGameState, resetGame, setGameMode } = gameSlice.actions;
export default gameSlice.reducer;
