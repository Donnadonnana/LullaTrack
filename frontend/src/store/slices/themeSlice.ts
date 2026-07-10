import { createSlice } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark";

type ThemeState = {
  mode: ThemeMode;
};

const savedMode = localStorage.getItem("themeMode");

const initialState: ThemeState = {
  mode: savedMode === "dark" ? "dark" : "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", state.mode);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;