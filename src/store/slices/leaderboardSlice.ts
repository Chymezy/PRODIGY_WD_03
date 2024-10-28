import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface LeaderboardEntry {
  username: string;
  rating: number;
  wins: number;
  gamesPlayed: number;
  winRate: number;
}

interface LeaderboardState {
  entries: LeaderboardEntry[];
  userRank: number;
  loading: boolean;
  error: string | null;
}

const initialState: LeaderboardState = {
  entries: [],
  userRank: 0,
  loading: false,
  error: null
};

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetch',
  async () => {
    const response = await axios.get('/api/leaderboard');
    return response.data;
  }
);

export const fetchUserRank = createAsyncThunk(
  'leaderboard/rank',
  async () => {
    const response = await axios.get('/api/leaderboard/rank');
    return response.data.rank;
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.entries = action.payload;
        state.loading = false;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch leaderboard';
        state.loading = false;
      })
      .addCase(fetchUserRank.fulfilled, (state, action) => {
        state.userRank = action.payload;
      });
  }
});

export default leaderboardSlice.reducer;
