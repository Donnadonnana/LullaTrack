import { Button, Stack, useTheme } from "@mui/material";

import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import WbTwilightRoundedIcon from "@mui/icons-material/WbTwilightRounded";

import type { SleepType } from "../../store/slices/sleepSlice";

type SleepActionButtonsProps = {
  hasWakeLog: boolean;
  hasNightSleepLog: boolean;
  onAddSleep: (type: SleepType) => void;
};

export default function SleepActionButtons({
  hasWakeLog,
  hasNightSleepLog,
  onAddSleep,
}: SleepActionButtonsProps) {
  const { nursery } = useTheme().palette;

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      sx={{ alignSelf: "flex-start", pt: 1.5, flexWrap: "wrap" }}
    >
      {!hasWakeLog && (
        <Button
          variant="outlined"
          startIcon={<WbTwilightRoundedIcon />}
          onClick={() => onAddSleep("wake")}
          sx={{
            borderColor: nursery.dawn,
            color: nursery.dawn,
            "&:hover": { borderColor: nursery.dawn, bgcolor: nursery.dawnTint },
          }}
        >
          Add wake-up time
        </Button>
      )}

      {!hasNightSleepLog && (
        <Button
          variant="outlined"
          startIcon={<LightModeRoundedIcon />}
          onClick={() => onAddSleep("nap")}
          sx={{
            borderColor: nursery.sun,
            color: nursery.sun,
            "&:hover": { borderColor: nursery.sun, bgcolor: nursery.sunTint },
          }}
        >
          Add another nap
        </Button>
      )}

      {!hasNightSleepLog && (
        <Button
          variant="outlined"
          startIcon={<DarkModeRoundedIcon />}
          onClick={() => onAddSleep("night")}
          sx={{
            borderColor: nursery.moon,
            color: nursery.moon,
            "&:hover": { borderColor: nursery.moon, bgcolor: nursery.moonTint },
          }}
        >
          Add night sleep
        </Button>
      )}
    </Stack>
  );
}
