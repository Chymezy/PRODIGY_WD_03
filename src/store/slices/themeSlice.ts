import { createSlice } from '@reduxjs/toolkit';
import { ThemeState } from '@/types';

const getInitialTheme = (): boolean => {
  // Check localStorage first
  if (typeof localStorage !== 'undefined') {
    if (localStorage.theme === 'dark') return true;
    if (localStorage.theme === 'light') return false;
  }
  
  // If no localStorage value, check system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  return false; // Default to light mode
};

const initialState: ThemeState = {
  isDarkMode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setTheme: (state, action) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
