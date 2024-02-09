import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import settingsReducer from './settingsSlice';
import userReducer from './userSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, settingsReducer);

export const store = configureStore({
  reducer: {
    settings: persistedReducer,
    user: userReducer,
  },
  // eslint-disable-next-line no-undef
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
