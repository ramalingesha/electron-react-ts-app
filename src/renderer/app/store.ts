import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // reducers added here feature by feature
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;