import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";

import { createSleepLog, type SleepType } from "../store/slices/sleepSlice";
import { useAppDispatch } from "../store/hooks";

import SleepCard from "../components/SleepCard/SleepCard";
import WakeWindow from "../components/WakeWindow/WakeWindow";
import DaySummary from "../components/DaySummary/DaySummary";
import LastNightSummary from "../components/LastNightSummary/LastNightSummary";
import DateNavigator from "../components/DateNavigator/DateNavigator";
import PageHeader from "../components/PageLayout/PageHeader";
import SleepEmptyState from "../components/SleepPage/SleepEmptyState";
import SleepActionButtons from "../components/SleepPage/SleepActionButtons";

import { useSleepDayData } from "../hooks/useSleepDayData";

export default function SleepPage() {
  const dispatch = useAppDispatch();

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );

  const {
    activeBaby,
    activeBabyId,
    activeBabyLogs,
    previousNightLog,
    napLogs,
    wakeLog,
    hasWakeLog,
    hasNightSleepLog,
    loading,
    error,
    lastNightMinutes,
    totalNapMinutes,
    totalSleepMinutes,
    avgSleepLatencyMinutes,
    avgAwakeBeforePickupMinutes,
    calculateWakeWindow,
  } = useSleepDayData(selectedDate);

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

    const sleepNumber =
      type === "wake" ? 0 : type === "night" ? 1 : napLogs.length + 1;

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
        <SleepEmptyState
          babyName={activeBaby.name}
          onAddSleep={handleAddSleep}
        />
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

          <SleepActionButtons
            hasWakeLog={hasWakeLog}
            hasNightSleepLog={hasNightSleepLog}
            onAddSleep={handleAddSleep}
          />
        </Stack>
      )}
    </Stack>
  );
}
