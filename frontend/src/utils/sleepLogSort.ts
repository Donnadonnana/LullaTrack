import type { SleepLog } from "../store/slices/sleepSlice";

// The list should read as a timeline, not a creation-order list — so we sort
// by each log's actual start time rather than sleepNumber. Wake logs start
// at wakeTime; nap/night logs start at onBedTime. Logs missing a time yet
// (just created, not filled in) sort to the end instead of jumping around.
export function getLogSortKey(log: SleepLog): string {
  const key =
    log.type === "wake"
      ? log.wakeTime
      : log.onBedTime || log.asleepTime || log.wakeTime || log.pickupTime;

  return key || "99:99";
}

export function average(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  return Math.round(
    values.reduce((sum, value) => sum + value, 0) / values.length,
  );
}
