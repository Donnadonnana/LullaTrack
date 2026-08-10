import { Box, Stack, Typography } from "@mui/material";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";

import { formatDuration } from "../../utils/time";

type LastNightSummaryProps = {
  babyName: string;
  totalMinutes: number;
  asleepTime: string;
  wakeTime: string;
};

// Cozy nursery palette — keep in sync with the other sleep components
const INK = "#3A3450";
const INK_SOFT = "#8B8398";
const MOON = "#6C63AC";
const MOON_TINT = "rgba(108, 99, 172, 0.10)";
const FONT_DISPLAY = "'Fraunces', Georgia, serif";

export default function LastNightSummary({
  babyName,
  totalMinutes,
  asleepTime,
  wakeTime,
}: LastNightSummaryProps) {
  return (
    <Box
      sx={{
        borderRadius: 4,
        p: 2,
        bgcolor: MOON_TINT,
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
          <DarkModeRoundedIcon sx={{ fontSize: 20, color: MOON }} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 600,
              fontSize: 15,
              color: INK,
            }}
          >
            {babyName} slept{" "}
            <Box component="span" sx={{ color: MOON }}>
              {formatDuration(totalMinutes)}
            </Box>{" "}
            last night
          </Typography>

          <Typography sx={{ color: INK_SOFT, fontSize: 13 }}>
            {asleepTime} – {wakeTime}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
