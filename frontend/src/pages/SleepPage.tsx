import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
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
import DateNavigator from "../components/DateNavigator/DateNavigator";
import PageHeader from "../components/PageLayout/PageHeader";

import { calculateWakeWindow } from "../utils/time";

// Cozy nursery palette — keep in sync with SleepCard.tsx / WakeWindow.tsx
const INK = "#3A3450";
const INK_SOFT = "#8B8398";
const BORDER = "#EEE3D8";
const MOON = "#6C63AC";
const MOON_TINT = "rgba(108, 99, 172, 0.10)";
const SUN = "#E1963C";
const SUN_TINT = "rgba(225, 150, 60, 0.12)";
const DAWN = "#E0876B";
const DAWN_TINT = "rgba(224, 135, 107, 0.14)";
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
      .slice()
      .sort((first, second) =>
        getLogSortKey(first).localeCompare(getLogSortKey(second)),
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
  }, [activeBabyId, selectedDate, dispatch]);

  const hasWakeLog = activeBabyLogs.some((log) => log.type === "wake");
  const hasNightSleepLog = activeBabyLogs.some((log) => log.type === "night");

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

    const napCount = activeBabyLogs.filter((log) => log.type === "nap").length;

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

      {loading && activeBabyLogs.length === 0 ? (
        <Box sx={{ minHeight: 360, display: "grid", placeItems: "center" }}>
          <CircularProgress sx={{ color: MOON }} />
        </Box>
      ) : activeBabyLogs.length === 0 ? (
        <Box
          sx={{
            minHeight: 360,
            border: `1px dashed ${BORDER}`,
            borderRadius: 5,
            display: "grid",
            placeItems: "center",
            p: 4,
            bgcolor: "rgba(225, 150, 60, 0.04)",
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
                background: `linear-gradient(135deg, ${DAWN_TINT}, ${SUN_TINT})`,
              }}
            >
              <BedtimeRoundedIcon sx={{ fontSize: 36, color: MOON }} />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 600,
                  fontSize: 22,
                  color: INK,
                }}
              >
                Start the day
              </Typography>

              <Typography sx={{ color: INK_SOFT, mt: 0.75 }}>
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
                    borderRadius: 999,
                    borderColor: SUN,
                    color: SUN,
                    "&:hover": { borderColor: SUN, bgcolor: SUN_TINT },
                  }}
                >
                  Add a nap instead
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<DarkModeRoundedIcon />}
                  onClick={() => void handleAddSleep("night")}
                  sx={{
                    borderRadius: 999,
                    borderColor: MOON,
                    color: MOON,
                    "&:hover": { borderColor: MOON, bgcolor: MOON_TINT },
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
                  borderRadius: 999,
                  borderColor: DAWN,
                  color: DAWN,
                  "&:hover": { borderColor: DAWN, bgcolor: DAWN_TINT },
                }}
              >
                Add wake-up time
              </Button>
            )}

            {!hasNightSleepLog && (
              <Button
                variant="outlined"
                startIcon={<LightModeRoundedIcon />}
                onClick={() => void handleAddSleep("nap")}
                sx={{
                  borderRadius: 999,
                  borderColor: SUN,
                  color: SUN,
                  "&:hover": { borderColor: SUN, bgcolor: SUN_TINT },
                }}
              >
                Add another nap
              </Button>
            )}
            {!hasNightSleepLog && (
              <Button
                variant="outlined"
                startIcon={<DarkModeRoundedIcon />}
                onClick={() => void handleAddSleep("night")}
                sx={{
                  borderRadius: 999,
                  borderColor: MOON,
                  color: MOON,
                  "&:hover": { borderColor: MOON, bgcolor: MOON_TINT },
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
