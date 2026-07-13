import { configureStore } from "@reduxjs/toolkit";

import appReducer from "./slices/appSlice";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice";
import babyReducer from "./slices/babySlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    theme: themeReducer,
    auth: authReducer,
    babies: babyReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;