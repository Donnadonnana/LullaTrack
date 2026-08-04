import type { Timestamp } from "firebase-admin/firestore";

export type SleepType = "nap" | "night";

export type SleepLog = {
  id: string;
  userId: string;
  babyId: string;
  date: string;
  type: SleepType;
  sleepNumber: number;
  notes: "string";

  onBedTime: string;
  asleepTime: string;
  wakeTime: string;
  pickupTime: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type CreateSleepLogRequest = {
  userId: string;
  babyId: string;
  date: string;
  type: SleepType;
  sleepNumber: number;
};

export type UpdateSleepLogRequest = Partial<
  Pick<
    SleepLog,
    "onBedTime" | "asleepTime" | "wakeTime" | "pickupTime" | "notes"
  >
>;
