import dayjs from "dayjs";

export function formatTimeInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (!digits) {
    return "";
  }

  let hours: number;
  let minutes: number;

  if (digits.length <= 2) {
    hours = Number(digits);
    minutes = 0;
  } else if (digits.length === 3) {
    hours = Number(digits.slice(0, 1));
    minutes = Number(digits.slice(1));
  } else {
    hours = Number(digits.slice(0, 2));
    minutes = Number(digits.slice(2));
  }

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours > 23 ||
    minutes > 59
  ) {
    return value;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

export function timeToMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

export function calculateDuration(
  startTime: string,
  endTime: string,
): number | null {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  if (start === null || end === null) {
    return null;
  }

  // Supports night sleep crossing midnight.
  return end >= start ? end - start : 24 * 60 - start + end;
}

export function formatDuration(totalMinutes: number | null): string {
  if (totalMinutes === null) {
    return "";
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}

export function calculateWakeWindow(
  previousPickupTime: string,
  nextOnBedTime: string,
): number | null {
  return calculateDuration(previousPickupTime, nextOnBedTime);
}

export function calculateFeedingDuration(
  startTime: string,
  endTime: string,
): number | null {
  if (!startTime || !endTime) {
    return null;
  }

  const [startHour, startMinute] = startTime.split(":").map(Number);

  const [endHour, endMinute] = endTime.split(":").map(Number);

  if (
    Number.isNaN(startHour) ||
    Number.isNaN(startMinute) ||
    Number.isNaN(endHour) ||
    Number.isNaN(endMinute)
  ) {
    return null;
  }

  const startTotal = startHour * 60 + startMinute;

  let endTotal = endHour * 60 + endMinute;

  if (endTotal < startTotal) {
    endTotal += 24 * 60;
  }

  return endTotal - startTotal;
}
/**
 * Duration between an evening asleep-time and a next-morning wake-time.
 * Unlike calculateDuration, this assumes wakeTime is on the day AFTER
 * asleepTime whenever it's numerically earlier or equal (i.e. crosses midnight).
 */
export function calculateOvernightDuration(
  asleepTime: string,
  wakeTime: string,
): number | null {
  if (!asleepTime || !wakeTime) {
    return null;
  }

  const asleep = dayjs(`2000-01-01 ${asleepTime}`);
  let wake = dayjs(`2000-01-01 ${wakeTime}`);

  if (!asleep.isValid() || !wake.isValid()) {
    return null;
  }

  if (!wake.isAfter(asleep)) {
    wake = wake.add(1, "day");
  }

  return wake.diff(asleep, "minute");
}
