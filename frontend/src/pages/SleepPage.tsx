import { Box, Button, Stack, Typography } from "@mui/material";

import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import { useState } from "react";
import dayjs from "dayjs";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addSleepLog, type SleepType } from "../store/slices/sleepSlice";

import SleepCard from "../components/SleepCard/SleepCard";
import WakeWindow from "../components/WakeWindow/WakeWindow";
import DateNavigator from "../components/DateNavigator/DateNavigator";

import { calculateWakeWindow } from "../utils/time";

export default function SleepPage() {
  const dispatch = useAppDispatch();

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );

  const { babies, activeBabyId } = useAppSelector((state) => state.babies);

  const activeBaby = babies.find((baby) => baby.id === activeBabyId);

  const activeBabyLogs = useAppSelector((state) =>
    state.sleep.logs.filter(
      (log) => log.babyId === activeBabyId && log.date === selectedDate,
    ),
  );

  const hasNightSleepLog = activeBabyLogs.some((log) => log.type === "night");

  const handleAddSleep = (type: SleepType) => {
    if (!activeBabyId) {
      return;
    }

    if (type === "night" && hasNightSleepLog) {
      return;
    }

    const napCount = activeBabyLogs.filter((log) => log.type === "nap").length;

    dispatch(
      addSleepLog({
        babyId: activeBabyId,
        date: selectedDate,
        type,
        sleepNumber: type === "night" ? 1 : napCount + 1,
      }),
    );
  };

  if (!activeBaby) {
    return <Typography>Select or add a baby before tracking sleep.</Typography>;
  }

  return (
    <Stack spacing={3}>
      <DateNavigator value={selectedDate} onChange={setSelectedDate} />

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        sx={{
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          size="large"
          startIcon={<LightModeOutlinedIcon />}
          onClick={() => handleAddSleep("nap")}
        >
          Add nap
        </Button>

        {!hasNightSleepLog && (
          <Button
            variant="outlined"
            size="large"
            startIcon={<DarkModeOutlinedIcon />}
            onClick={() => handleAddSleep("night")}
          >
            Add night sleep
          </Button>
        )}
      </Stack>

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
                Add {activeBaby.name}&apos;s first nap or night sleep.
              </Typography>
            </Box>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<LightModeOutlinedIcon />}
                onClick={() => handleAddSleep("nap")}
              >
                Add first nap
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
          </Stack>
        </Box>
      ) : (
        <Stack spacing={2}>
          {activeBabyLogs.map((log, index) => {
            const previousLog = index > 0 ? activeBabyLogs[index - 1] : null;

            const wakeWindow = previousLog
              ? calculateWakeWindow(previousLog.pickupTime, log.onBedTime)
              : null;

            return (
              <Box key={log.id}>
                {wakeWindow !== null && (
                  <WakeWindow durationMinutes={wakeWindow} />
                )}

                <SleepCard log={log} babyName={activeBaby.name} />
              </Box>
            );
          })}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            sx={{
              alignSelf: "flex-start",
            }}
          >
            <Button
              variant="outlined"
              size="large"
              startIcon={<LightModeOutlinedIcon />}
              onClick={() => handleAddSleep("nap")}
            >
              Add another nap
            </Button>

            {!hasNightSleepLog && (
              <Button
                variant="outlined"
                size="large"
                startIcon={<DarkModeOutlinedIcon />}
                onClick={() => handleAddSleep("night")}
              >
                Add night sleep
              </Button>
            )}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
