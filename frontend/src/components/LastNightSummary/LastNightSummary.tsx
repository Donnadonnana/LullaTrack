import { Box, Stack, Typography, useTheme } from "@mui/material";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";

import { formatDuration } from "../../utils/time";

type LastNightSummaryProps = {
  babyName: string;
  totalMinutes: number;
  asleepTime: string;
  wakeTime: string;
};

const FONT_DISPLAY = "'Fraunces', Georgia, serif";

export default function LastNightSummary({
  babyName,
  totalMinutes,
  asleepTime,
  wakeTime,
}: LastNightSummaryProps) {
  const theme = useTheme();
  const { nursery } = theme.palette;

  return (
    <Box
      sx={{
        borderRadius: 4,
        p: 2,
        bgcolor: nursery.moonTint,
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            bgcolor: "rgba(255, 255, 255, 0.6)",
          }}
        >
          <DarkModeRoundedIcon sx={{ fontSize: 20, color: nursery.moon }} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 600,
              fontSize: 15,
              color: "text.primary",
            }}
          >
            {babyName} slept{" "}
            <Box component="span" sx={{ color: nursery.moon }}>
              {formatDuration(totalMinutes)}
            </Box>{" "}
            last night
          </Typography>

          <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
            {asleepTime} – {wakeTime}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
