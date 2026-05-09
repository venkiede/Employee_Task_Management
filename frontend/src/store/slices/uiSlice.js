import { createSlice } from '@reduxjs/toolkit';

// Read initial theme from localStorage, default to 'dark'
const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem('theme');
    return stored || 'dark';
  } catch {
    return 'dark';
  }
};

const initialState = {
  sidebarOpen: false,
  theme: getInitialTheme(), // 'light' | 'dark'
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      // Persist to localStorage
      localStorage.setItem('theme', state.theme);
      // Toggle the .dark class on <html>
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', state.theme);
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
  },
});

export const { toggleSidebar, setSidebarOpen, toggleTheme, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
