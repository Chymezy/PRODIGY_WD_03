import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, Player } from '@/types';

const initialState: GameState = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
  winner: null,
  gameMode: 'PVP',
  isGameOver: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    makeMove: (state, action: PayloadAction<number>) => {
      if (!state.board[action.payload] && !state.isGameOver) {
        state.board[action.payload] = state.currentPlayer;
        state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
      }
    },
    setWinner: (state, action: PayloadAction<Player | 'draw'>) => {
      state.winner = action.payload;
      state.isGameOver = true;
    },
    setGameMode: (state, action: PayloadAction<'AI' | 'PVP'>) => {
      state.gameMode = action.payload;
    },
    resetGame: (state) => {
      state.board = Array(9).fill(null);
      state.currentPlayer = 'X';
      state.winner = null;
      state.isGameOver = false;
    },
  },
});

export const { makeMove, setWinner, setGameMode, resetGame } = gameSlice.actions;
export default gameSlice.reducer;
