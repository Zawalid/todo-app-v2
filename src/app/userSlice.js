import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  isMenuOpen: window.matchMedia('(min-width: 1024px)').matches,
};

const userSlice = createSlice({
  initialState,
  name: 'user',
  reducers: {
    logUserIn: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('UID', action.payload.$id);
    },
    authenticateUser: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    logUserOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.setItem('UID', null);
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
  },
});

export const { logUserIn, authenticateUser, logUserOut, updateUserProfile, toggleMenu } =
  userSlice.actions;
export default userSlice.reducer;
