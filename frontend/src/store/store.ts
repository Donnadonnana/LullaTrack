import { configureStore } from "@reduxjs/toolkit";

import appReducer from "./slices/appSlice";
import authReducer from "./slices/authSlice";
import babyReducer from "./slices/babySlice";
import themeReducer from "./slices/themeSlice";
import sleepReducer from "./slices/sleepSlice";
import feedingReducer from "./slices/feedingSlice"

import {
  loadPersistedState,
  savePersistedState,
} from "./persistence";

const persistedState = loadPersistedState();

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    babies: babyReducer,
    theme: themeReducer,
    sleep: sleepReducer,
    feed: feedingReducer
  },

  preloadedState: persistedState
    ? {
        auth: persistedState.auth,

        babies: {
          babies: persistedState.babies.babies,
          activeBabyId: persistedState.babies.activeBabyId,

          // Do not restore unfinished onboarding state.
          onboarding: {
            mode: "create" as const,
            step: 0,
            draft: {
              name: "",
              gender: "" as const,
              ageMonths: null,
              feedingMethod: "" as const,
              daySleepHours: null,
              nightSleepHours: null,
            },
          },
        },

        theme: persistedState.theme,
      }
    : undefined,
});

store.subscribe(() => {
  const state = store.getState();

  savePersistedState({
    auth: {
      user: state.auth.user,
    },

    babies: {
      babies: state.babies.babies,
      activeBabyId: state.babies.activeBabyId,
    },

    theme: {
      mode: state.theme.mode,
    },
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;