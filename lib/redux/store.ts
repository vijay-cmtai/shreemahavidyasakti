import { configureStore } from '@reduxjs/toolkit';
import gallerySlice from './features/gallerySlice';
import leadSlice from './features/leadSlice';

export const store = configureStore({
  reducer: {
    gallery: gallerySlice,
    leads: leadSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
