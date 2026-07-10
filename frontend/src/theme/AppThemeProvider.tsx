import { useMemo, type ReactNode } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { useAppSelector } from "../store/hooks";
import { createAppTheme } from "./theme";

type AppThemeProviderProps = {
  children: ReactNode;
};

export default function AppThemeProvider({
  children,
}: AppThemeProviderProps) {
  const mode = useAppSelector((state) => state.theme.mode);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}