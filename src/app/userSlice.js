import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
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
  },
});

export const { logUserIn, logUserOut,updateUserProfile } = userSlice.actions;
export default userSlice.reducer;
