import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '@/types';

const initialState: UserState = {
  id: null,
  email: null,
  username: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.username = action.payload.username;
    },
    clearUser: (state) => {
      state.id = null;
      state.email = null;
      state.username = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
