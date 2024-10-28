import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: Date;
}

interface AchievementState {
  achievements: Achievement[];
  loading: boolean;
  error: string | null;
}

const initialState: AchievementState = {
  achievements: [],
  loading: false,
  error: null
};

export const fetchAchievements = createAsyncThunk(
  'achievements/fetch',
  async () => {
    const response = await axios.get('/api/achievements');
    return response.data;
  }
);

const achievementSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    addAchievement: (state, action) => {
      state.achievements.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAchievements.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.achievements = action.payload;
        state.loading = false;
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch achievements';
        state.loading = false;
      });
  }
});

export const { addAchievement } = achievementSlice.actions;
export default achievementSlice.reducer;
