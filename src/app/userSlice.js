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
      state.isAuthenticated = true;
    },
    logUserOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
  },
});

export const { logUserIn, logUserOut,updateUserProfile,toggleMenu } = userSlice.actions;
export default userSlice.reducer;
