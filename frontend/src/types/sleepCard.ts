import type { SleepLog } from "../store/slices/sleepSlice";

export type SleepDraft = Pick<
  SleepLog,
  "onBedTime" | "asleepTime" | "wakeTime" | "pickupTime" | "notes"
>;

export function isLogComplete(
  type: SleepLog["type"],
  sleep: SleepDraft,
): boolean {
  if (type === "wake") {
    return Boolean(sleep.wakeTime && sleep.pickupTime);
  }

  if (type === "night") {
    return Boolean(sleep.onBedTime && sleep.asleepTime);
  }

  // Nap: on-bed + pickup is enough to consider it "done" — asleep/wake are
  // often missing when baby is put down, cries the whole time, and gets
  // picked back up without ever actually falling asleep.
  return Boolean(sleep.onBedTime && sleep.pickupTime);
}

// "In progress" means something has been logged but the log can't close
// yet — distinct from a brand-new card with nothing entered at all.
export function isInProgress(
  type: SleepLog["type"],
  sleep: SleepDraft,
): boolean {
  if (type === "wake") {
    return Boolean(sleep.wakeTime) && !sleep.pickupTime;
  }

  if (type === "night") {
    return Boolean(sleep.onBedTime) && !sleep.asleepTime;
  }

  return Boolean(sleep.onBedTime) && !sleep.pickupTime;
}
