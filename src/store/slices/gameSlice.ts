import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState } from '@/types';

const initialState: GameState = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
  winner: null,
  gameMode: 'ONLINE',
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
      if (state.board[action.payload] === null && !state.isGameOver) {
        state.board[action.payload] = state.currentPlayer;
        state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
      }
    },
    setGameState: (state, action: PayloadAction<Partial<GameState>>) => {
      return { ...state, ...action.payload };
    },
    resetGame: () => initialState,
    setGameMode: (state, action: PayloadAction<'AI' | 'PVP' | 'ONLINE'>) => {
      state.gameMode = action.payload;
    }
  }
});

export const { makeMove, setGameState, resetGame, setGameMode } = gameSlice.actions;
export default gameSlice.reducer;
