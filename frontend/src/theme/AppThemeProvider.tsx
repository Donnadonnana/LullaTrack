import { useMemo, type ReactNode } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { useAppSelector } from "../store/hooks";
import { createAppTheme } from "./theme";

type AppThemeProviderProps = {
  children: ReactNode;
};

export default function AppThemeProvider({
  children,
}: AppThemeProviderProps) {
  const mode = useAppSelector(
    (state) => state.theme.mode,
  );

  const theme = useMemo(
    () => createAppTheme(mode),
    [mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
}