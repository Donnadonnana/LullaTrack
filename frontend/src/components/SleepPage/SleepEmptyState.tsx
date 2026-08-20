import { Box, Button, Stack, Typography, useTheme } from "@mui/material";

import BedtimeRoundedIcon from "@mui/icons-material/BedtimeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import WbTwilightRoundedIcon from "@mui/icons-material/WbTwilightRounded";

import type { SleepType } from "../../store/slices/sleepSlice";

const FONT_DISPLAY = "'Fraunces', Georgia, serif";

type SleepEmptyStateProps = {
  babyName: string;
  onAddSleep: (type: SleepType) => void;
};

export default function SleepEmptyState({
  babyName,
  onAddSleep,
}: SleepEmptyStateProps) {
  const { nursery } = useTheme().palette;

  return (
    <Box
      sx={{
        minHeight: 360,
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 5,
        display: "grid",
        placeItems: "center",
        p: 4,
        bgcolor: nursery.emptyStateBg,
      }}
    >
      <Stack
        spacing={2.5}
        sx={{ alignItems: "center", textAlign: "center", maxWidth: 340 }}
      >
        <Box
          sx={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            background: `linear-gradient(135deg, ${nursery.dawnTint}, ${nursery.sunTint})`,
          }}
        >
          <BedtimeRoundedIcon sx={{ fontSize: 36, color: nursery.moon }} />
        </Box>

        <Box>
          <Typography
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 600,
              fontSize: 22,
              color: "text.primary",
            }}
          >
            Start the day
          </Typography>

          <Typography sx={{ color: "text.secondary", mt: 0.75 }}>
            Log what time {babyName} woke up this morning — that's the start of
            today's timeline.
          </Typography>
        </Box>

        <Stack spacing={1.25} sx={{ width: "100%" }}>
          <Button
            variant="contained"
            size="large"
            disableElevation
            startIcon={<WbTwilightRoundedIcon />}
            onClick={() => onAddSleep("wake")}
            sx={{
              borderRadius: 999,
              bgcolor: nursery.dawn,
              "&:hover": { bgcolor: "#C96F55" },
            }}
          >
            Log wake-up time
          </Button>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <Button
              variant="outlined"
              startIcon={<LightModeRoundedIcon />}
              onClick={() => onAddSleep("nap")}
              sx={{
                borderColor: nursery.sun,
                color: nursery.sun,
                "&:hover": {
                  borderColor: nursery.sun,
                  bgcolor: nursery.sunTint,
                },
              }}
            >
              Add a nap instead
            </Button>

            <Button
              variant="outlined"
              startIcon={<DarkModeRoundedIcon />}
              onClick={() => onAddSleep("night")}
              sx={{
                borderColor: nursery.moon,
                color: nursery.moon,
                "&:hover": {
                  borderColor: nursery.moon,
                  bgcolor: nursery.moonTint,
                },
              }}
            >
              Log night sleep
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
