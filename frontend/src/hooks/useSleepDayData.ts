import { useEffect } from "react";
import dayjs from "dayjs";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchSleepLogs } from "../store/slices/sleepSlice";
import {
  calculateDuration,
  calculateOvernightDuration,
  calculateWakeWindow,
} from "../utils/time";
import { average, getLogSortKey } from "../utils/sleepLogSort";

export function useSleepDayData(selectedDate: string) {
  const dispatch = useAppDispatch();

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

  const napLogs = activeBabyLogs.filter((log) => log.type === "nap");
  const wakeLog = activeBabyLogs.find((log) => log.type === "wake");
  const hasWakeLog = Boolean(wakeLog);
  const hasNightSleepLog = activeBabyLogs.some((log) => log.type === "night");

  useEffect(() => {
    if (!activeBabyId) {
      return;
    }

    void dispatch(fetchSleepLogs({ babyId: activeBabyId, date: selectedDate }));
  }, [activeBabyId, selectedDate, dispatch]);

  // Yesterday's logs are only needed to compute last night's sleep, which
  // requires today's wake-up time to exist first.
  useEffect(() => {
    if (!activeBabyId || !hasWakeLog) {
      return;
    }

    void dispatch(fetchSleepLogs({ babyId: activeBabyId, date: previousDate }));
  }, [activeBabyId, previousDate, hasWakeLog, dispatch]);

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

  return {
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
  };
}
