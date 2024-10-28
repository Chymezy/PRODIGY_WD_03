import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import leaderboardReducer from './slices/leaderboardSlice';
import achievementReducer from './slices/achievementSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    auth: authReducer,
    theme: themeReducer,
    leaderboard: leaderboardReducer,
    achievements: achievementReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
