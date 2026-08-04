import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import { useEffect, useState } from "react";

import dayjs from "dayjs";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import {
  createSleepLog,
  fetchSleepLogs,
  type SleepType,
} from "../store/slices/sleepSlice";

import SleepCard from "../components/SleepCard/SleepCard";
import WakeWindow from "../components/WakeWindow/WakeWindow";
import DateNavigator from "../components/DateNavigator/DateNavigator";
import PageHeader from "../components/PageLayout/PageHeader";

import { calculateWakeWindow } from "../utils/time";

export default function SleepPage() {
  const dispatch = useAppDispatch();

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );

  const { babies, activeBabyId } = useAppSelector((state) => state.babies);

  const { loading, error } = useAppSelector((state) => state.sleep);

  const activeBaby = babies.find((baby) => baby.id === activeBabyId);

  const activeBabyLogs = useAppSelector((state) =>
    state.sleep.logs
      .filter((log) => log.babyId === activeBabyId && log.date === selectedDate)
      .sort((first, second) => first.sleepNumber - second.sleepNumber),
  );

  useEffect(() => {
    if (!activeBabyId) {
      return;
    }

    void dispatch(
      fetchSleepLogs({
        babyId: activeBabyId,
        date: selectedDate,
      }),
    );
  }, [activeBabyId, selectedDate, dispatch]);

  const hasNightSleepLog = activeBabyLogs.some((log) => log.type === "night");

  const handleAddSleep = async (type: SleepType) => {
    if (!activeBabyId) {
      return;
    }

    if (type === "night" && hasNightSleepLog) {
      return;
    }

    const napCount = activeBabyLogs.filter((log) => log.type === "nap").length;

    try {
      await dispatch(
        createSleepLog({
          babyId: activeBabyId,
          date: selectedDate,
          type,
          sleepNumber: type === "night" ? 1 : napCount + 1,
        }),
      ).unwrap();
    } catch (error) {
      console.error("Unable to create sleep log:", error);
    }
  };

  if (!activeBaby) {
    return <Typography>Select or add a baby before tracking sleep.</Typography>;
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Sleep"
        rightContent={
          <DateNavigator value={selectedDate} onChange={setSelectedDate} />
        }
      />

      {error && <Alert severity="error">{error}</Alert>}

      {loading && activeBabyLogs.length === 0 ? (
        <Box
          sx={{
            minHeight: 360,
            display: "grid",
            placeItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : activeBabyLogs.length === 0 ? (
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
                onClick={() => void handleAddSleep("nap")}
              >
                Add first nap
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<DarkModeOutlinedIcon />}
                onClick={() => void handleAddSleep("night")}
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
              onClick={() => void handleAddSleep("nap")}
            >
              Add another nap
            </Button>

            {!hasNightSleepLog && (
              <Button
                variant="outlined"
                size="large"
                startIcon={<DarkModeOutlinedIcon />}
                onClick={() => void handleAddSleep("night")}
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
