import { createTheme } from "@mui/material/styles";
import type { ThemeMode } from "../store/slices/themeSlice";

export const createAppTheme = (mode: ThemeMode) =>
  createTheme({
    palette: {
      mode,

      primary: {
        main: "#7c6ff6",
      },

      secondary: {
        main: "#ffb6a3",
      },

      background: {
        default: mode === "light" ? "#f7f7fb" : "#121212",
        paper: mode === "light" ? "#ffffff" : "#1e1e1e",
      },
    },

    shape: {
      borderRadius: 12,
    },

    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  });