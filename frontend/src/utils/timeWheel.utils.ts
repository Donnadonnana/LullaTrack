import dayjs from "dayjs";

export type TimeParts = { hour12: number; minute: number; period: "AM" | "PM" };

export function to12Hour(hour24: number, minute: number): TimeParts {
  const period: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return { hour12, minute, period };
}

export function to24HourString(
  hour12: number,
  minute: number,
  period: "AM" | "PM",
): string {
  let hour24 = hour12 % 12;
  if (period === "PM") hour24 += 12;
  return `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function parseTimeValue(value: string): TimeParts {
  if (!value) {
    const now = dayjs();
    return to12Hour(now.hour(), now.minute());
  }

  const [hour24, minute] = value.split(":").map(Number);
  return to12Hour(hour24 || 0, minute || 0);
}

export function formatDisplayTime(value: string): string {
  if (!value) return "";
  const { hour12, minute, period } = parseTimeValue(value);
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}
