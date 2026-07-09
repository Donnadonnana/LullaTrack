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
import { useMatches } from "react-router-dom";

export default function PageHeader() {
  const theme = useTheme();

  // Get current route
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];

  // Route title (fallback to Dashboard)
  const title =
    (currentMatch.handle as { title?: string })?.title ?? "Dashboard";

  // Dummy data for now
  const babyName = "Dylan";

  const handleThemeToggle = () => {
    console.log("toggle theme");
  };

  return (
    <Box sx={{ px: 6, pt: 6 }}>
      <Stack
        direction="row"
        sx={{
          mb: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "700" }}>
          {title}
        </Typography>

        <Stack direction="row" sx={{ spacing: 3, alignItems: "center" }}>
          <Typography variant="body1" color="text.secondary">
            👶 {babyName}
          </Typography>

          <IconButton onClick={handleThemeToggle}>
            {theme.palette.mode === "dark" ? (
              <LightModeIcon />
            ) : (
              <DarkModeIcon />
            )}
          </IconButton>
        </Stack>
      </Stack>

      <Divider />
    </Box>
  );
}
