import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import BedtimeRoundedIcon from "@mui/icons-material/BedtimeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import WbTwilightRoundedIcon from "@mui/icons-material/WbTwilightRounded";

import { useEffect, useState } from "react";

import dayjs from "dayjs";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import {
  createSleepLog,
  fetchSleepLogs,
  type SleepLog,
  type SleepType,
} from "../store/slices/sleepSlice";

import SleepCard from "../components/SleepCard/SleepCard";
import WakeWindow from "../components/WakeWindow/WakeWindow";
import DaySummary from "../components/DaySummary/DaySummary";
import LastNightSummary from "../components/LastNightSummary/LastNightSummary";
import DateNavigator from "../components/DateNavigator/DateNavigator";
import PageHeader from "../components/PageLayout/PageHeader";

import {
  calculateDuration,
  calculateOvernightDuration,
  calculateWakeWindow,
} from "../utils/time";

const FONT_DISPLAY = "'Fraunces', Georgia, serif";

// The list should read as a timeline, not a creation-order list — so we sort
// by each log's actual start time rather than sleepNumber. Wake logs start
// at wakeTime; nap/night logs start at onBedTime. Logs missing a time yet
// (just created, not filled in) sort to the end instead of jumping around.
function getLogSortKey(log: SleepLog): string {
  const key =
    log.type === "wake"
      ? log.wakeTime
      : log.onBedTime || log.asleepTime || log.wakeTime || log.pickupTime;

  return key || "99:99";
}

function average(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  return Math.round(
    values.reduce((sum, value) => sum + value, 0) / values.length,
  );
}

export default function SleepPage() {
  const dispatch = useAppDispatch();
  const { nursery } = useTheme().palette;
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );

  const previousDate = dayjs(selectedDate)
    .subtract(1, "day")
    .format("YYYY-MM-DD");

  const { babies, activeBabyId } = useAppSelector((state) => state.babies);

  const { loading, error } = useAppSelector((state) => state.sleep);

  const activeBaby = babies.find((baby) => baby.id === activeBabyId);

  const activeBabyLogs = useAppSelector((state) =>
    state.sleep.logs
      .filter((log) => log.babyId === activeBabyId && log.date === selectedDate)
      .slice()
      .sort((first, second) =>
        getLogSortKey(first).localeCompare(getLogSortKey(second)),
      ),
  );

  // Last night's sleep spans two calendar days (bedtime yesterday, wake-up
  // today), so we need yesterday's logs in the store too — just to read
  // the night log's asleepTime and pair it with today's wake log.
  const previousNightLog = useAppSelector((state) =>
    state.sleep.logs.find(
      (log) =>
        log.babyId === activeBabyId &&
        log.date === previousDate &&
        log.type === "night",
    ),
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

    void dispatch(
      fetchSleepLogs({
        babyId: activeBabyId,
        date: previousDate,
      }),
    );
  }, [activeBabyId, selectedDate, previousDate, dispatch]);

  const napLogs = activeBabyLogs.filter((log) => log.type === "nap");
  const wakeLog = activeBabyLogs.find((log) => log.type === "wake");
  const hasWakeLog = Boolean(wakeLog);
  const hasNightSleepLog = activeBabyLogs.some((log) => log.type === "night");

  // "Last night's sleep" = yesterday's night log's asleep time through
  // today's wake-up time. Only resolvable once both sides exist.
  const lastNightMinutes =
    previousNightLog?.asleepTime && wakeLog?.wakeTime
      ? calculateOvernightDuration(
          previousNightLog.asleepTime,
          wakeLog.wakeTime,
        )
      : null;

  const totalNapMinutes = napLogs.reduce((total, log) => {
    const duration = calculateDuration(log.asleepTime, log.wakeTime);
    return total + (duration ?? 0);
  }, 0);

  const totalSleepMinutes =
    lastNightMinutes !== null ? totalNapMinutes + lastNightMinutes : null;

  const avgSleepLatencyMinutes = average(
    napLogs
      .map((log) => calculateDuration(log.onBedTime, log.asleepTime))
      .filter((value): value is number => value !== null),
  );

  const avgAwakeBeforePickupMinutes = average(
    napLogs
      .map((log) => calculateDuration(log.wakeTime, log.pickupTime))
      .filter((value): value is number => value !== null),
  );

  const handleAddSleep = async (type: SleepType) => {
    if (!activeBabyId) {
      return;
    }

    if (type === "night" && hasNightSleepLog) {
      return;
    }

    if (type === "wake" && hasWakeLog) {
      return;
    }

    const napCount = napLogs.length;

    const sleepNumber =
      type === "wake" ? 0 : type === "night" ? 1 : napCount + 1;

    try {
      await dispatch(
        createSleepLog({
          babyId: activeBabyId,
          date: selectedDate,
          type,
          sleepNumber,
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

      {error && (
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      {hasNightSleepLog ? (
        <DaySummary
          babyName={activeBaby.name}
          napCount={napLogs.length}
          totalNapMinutes={totalNapMinutes}
          nightSleepMinutes={lastNightMinutes}
          totalSleepMinutes={totalSleepMinutes}
          avgSleepLatencyMinutes={avgSleepLatencyMinutes}
          avgAwakeBeforePickupMinutes={avgAwakeBeforePickupMinutes}
        />
      ) : (
        lastNightMinutes !== null &&
        previousNightLog?.asleepTime &&
        wakeLog?.wakeTime && (
          <LastNightSummary
            babyName={activeBaby.name}
            totalMinutes={lastNightMinutes}
            asleepTime={previousNightLog.asleepTime}
            wakeTime={wakeLog.wakeTime}
          />
        )
      )}

      {loading && activeBabyLogs.length === 0 ? (
        <Box sx={{ minHeight: 360, display: "grid", placeItems: "center" }}>
          <CircularProgress color="primary" />
        </Box>
      ) : activeBabyLogs.length === 0 ? (
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
                Log what time {activeBaby.name} woke up this morning — that's
                the start of today's timeline.
              </Typography>
            </Box>

            <Stack spacing={1.25} sx={{ width: "100%" }}>
              <Button
                variant="contained"
                size="large"
                disableElevation
                startIcon={<WbTwilightRoundedIcon />}
                onClick={() => void handleAddSleep("wake")}
                sx={{
                  borderRadius: 999,
                  bgcolor: DAWN,
                  "&:hover": { bgcolor: "#C96F55" },
                }}
              >
                Log wake-up time
              </Button>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                <Button
                  variant="outlined"
                  startIcon={<LightModeRoundedIcon />}
                  onClick={() => void handleAddSleep("nap")}
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
                  onClick={() => void handleAddSleep("night")}
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
      ) : (
        <Stack spacing={0.5}>
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
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ alignSelf: "flex-start", pt: 1.5, flexWrap: "wrap" }}
          >
            {!hasWakeLog && (
              <Button
                variant="outlined"
                startIcon={<WbTwilightRoundedIcon />}
                onClick={() => void handleAddSleep("wake")}
                sx={{
                  borderColor: nursery.dawn,
                  color: nursery.dawn,
                  "&:hover": {
                    borderColor: nursery.dawn,
                    bgcolor: nursery.dawnTint,
                  },
                }}
              >
                Add wake-up time
              </Button>
            )}

            <Button
              variant="outlined"
              startIcon={<LightModeRoundedIcon />}
              onClick={() => void handleAddSleep("nap")}
              sx={{
                borderColor: nursery.sun,
                color: nursery.sun,
                "&:hover": {
                  borderColor: nursery.sun,
                  bgcolor: nursery.sunTint,
                },
              }}
            >
              Add another nap
            </Button>

            {!hasNightSleepLog && (
              <Button
                variant="outlined"
                startIcon={<DarkModeRoundedIcon />}
                onClick={() => void handleAddSleep("night")}
                sx={{
                  borderColor: nursery.moon,
                  color: nursery.moon,
                  "&:hover": {
                    borderColor: nursery.moon,
                    bgcolor: nursery.moonTint,
                  },
                }}
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
