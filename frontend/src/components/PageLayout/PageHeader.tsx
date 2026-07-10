import {
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";

import { useMatches } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { toggleTheme } from "../../store/slices/themeSlice";

export default function PageHeader() {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  // Get current route
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];

  // Route title (fallback to Dashboard)
  const title =
    (currentMatch.handle as { title?: string })?.title ?? "Dashboard";

  // Dummy data for now, change to baby selector later
  const babyName = "Dylan";
  const isDarkMode = theme.palette.mode === "dark";

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

          <IconButton
            onClick={() => dispatch(toggleTheme())}
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </IconButton>
        </Stack>
      </Stack>

      <Divider />
    </Box>
  );
}
