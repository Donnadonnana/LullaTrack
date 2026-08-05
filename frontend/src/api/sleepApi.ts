import { apiRequest } from "./apiClient";

import type { SleepLog, SleepType } from "../store/slices/sleepSlice";

export type CreateSleepLogRequest = {
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

export function getSleepLogsApi(
  babyId: string,
  date: string,
  idToken: string,
): Promise<SleepLog[]> {
  const query = new URLSearchParams({
    babyId,
    date,
  });

  return apiRequest<SleepLog[]>(`/sleep?${query.toString()}`, {
    method: "GET",
    token: idToken,
  });
}

export function createSleepLogApi(
  data: CreateSleepLogRequest,
  idToken: string,
): Promise<SleepLog> {
  return apiRequest<SleepLog>("/sleep", {
    method: "POST",
    token: idToken,
    body: JSON.stringify(data),
  });
}

export function updateSleepLogApi(
  sleepLogId: string,
  changes: UpdateSleepLogRequest,
  idToken: string,
): Promise<SleepLog> {
  return apiRequest<SleepLog>(`/sleep/${sleepLogId}`, {
    method: "PATCH",
    token: idToken,
    body: JSON.stringify(changes),
  });
}

export function deleteSleepLogApi(
  sleepLogId: string,
  idToken: string,
): Promise<void> {
  return apiRequest<void>(`/sleep/${sleepLogId}`, {
    method: "DELETE",
    token: idToken,
  });
}
