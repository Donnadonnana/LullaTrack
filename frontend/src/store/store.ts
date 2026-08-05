import { configureStore } from "@reduxjs/toolkit";

import appReducer from "./slices/appSlice";
import authReducer from "./slices/authSlice";
import babyReducer from "./slices/babySlice";
import themeReducer from "./slices/themeSlice";
import sleepReducer from "./slices/sleepSlice";
import feedingReducer from "./slices/feedingSlice";

import { loadPersistedState, savePersistedState } from "./persistence";

const persistedState = loadPersistedState();

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    babies: babyReducer,
    theme: themeReducer,
    sleep: sleepReducer,
    feeding: feedingReducer,
  },

  preloadedState: persistedState
    ? {
        theme: persistedState.theme,
      }
    : undefined,
});

store.subscribe(() => {
  const state = store.getState();

  savePersistedState({
    theme: {
      mode: state.theme.mode,
    },
  });
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
