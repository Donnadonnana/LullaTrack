import {
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import type { ReactNode } from "react";

type PageLayoutProps = {
  title: string;
  children: ReactNode;
};

export default function PageLayout({ title, children }: PageLayoutProps) {
  const theme = useTheme();

  // dummy for now — later from auth/onboarding/global state
  const babyName = "Dylan";

  const isDark = theme.palette.mode === "dark";

  const handleThemeToggle = () => {
    console.log("toggle theme later");
  };

  return (
    <Box sx={{ px: 4, py: 3 }}>
      <Stack
        direction="row"
        component="header"
        sx={{ alignItems: "center", justifyContent: "center", mb: 2 }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>

        <Stack
          direction="row"
          component="div"
          sx={{ justifyContent: "center", alignItems: "center" }}
          spacing={2}
        >
          <Typography variant="body1" color="text.secondary">
            Baby: {babyName}
          </Typography>

          <IconButton onClick={handleThemeToggle}>
            {isDark ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 4 }} />

      <Box>{children}</Box>
    </Box>
  );
}
