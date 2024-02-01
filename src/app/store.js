import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';

const store = configureStore({
  reducer: settingsReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
