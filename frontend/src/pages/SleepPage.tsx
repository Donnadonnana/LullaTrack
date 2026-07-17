import { Box, Button, Stack, Typography } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addSleepLog, type SleepType } from "../store/slices/sleepSlice";

import SleepCard from "../components/SleepCard/SleepCard";

export default function SleepPage() {
  const dispatch = useAppDispatch();

  const { babies, activeBabyId } = useAppSelector((state) => state.babies);

  const logs = useAppSelector((state) => state.sleep.logs);

  const activeBaby = babies.find((baby) => baby.id === activeBabyId);

  const activeBabyLogs = logs.filter((log) => log.babyId === activeBabyId);

  const handleAddSleep = (type: SleepType) => {
    if (!activeBabyId) {
      return;
    }

    const sleepCount = activeBabyLogs.filter((log) => log.type === type).length;

    dispatch(
      addSleepLog({
        babyId: activeBabyId,
        type,
        sleepNumber: sleepCount + 1,
      }),
    );
  };
  if (!activeBaby) {
    return <Typography>Select or add a baby before tracking sleep.</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          sx={{ justifyContent: "flex-end" }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<LightModeOutlinedIcon />}
            onClick={() => handleAddSleep("nap")}
          >
            Add nap
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<DarkModeOutlinedIcon />}
            onClick={() => handleAddSleep("night")}
          >
            Add night sleep
          </Button>
        </Stack>
      </Box>

      {activeBabyLogs.length === 0 ? (
        <Box
          sx={{
            minHeight: 360,
            border: 1,
            borderStyle: "dashed",
            borderColor: "divider",
            borderRadius: 4,
            display: "grid",
            placeItems: "center",
            p: 4,
          }}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(165, 216, 255, 0.18)",
              }}
            >
              <BedtimeOutlinedIcon
                sx={{
                  fontSize: 36,
                  color: "info.main",
                }}
              />
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                }}
              >
                No sleep logged yet
              </Typography>

              <Typography
                sx={{
                  color: "text.secondary",
                  mt: 0.5,
                }}
              >
                Add {activeBaby.name}&apos;s first nap when you&apos;re ready.
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleAddNap}
            >
              Add first nap
            </Button>
          </Stack>
        </Box>
      ) : (
        <Stack spacing={2}>
          {activeBabyLogs.map((log) => (
            <SleepCard key={log.id} log={log} babyName={activeBaby.name} />
          ))}

          <Button
            variant="outlined"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleAddNap}
            sx={{
              alignSelf: "flex-start",
            }}
          >
            Add another nap
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
