import { apiRequest } from "./apiClient";

import type {
  FeedingLog,
  FeedingType,
  BreastSide,
  BottleMilkType,
} from "../store/slices/feedingSlice";

export type CreateFeedingLogRequest = {
  babyId: string;
  date: string;
  type: FeedingType;
  feedingNumber: number;
};

export type UpdateFeedingLogRequest = Partial<{
  startTime: string;
  endTime: string;
  side: BreastSide;
  amountMl: number | null;
  milkType: BottleMilkType;
  notes: string;
}>;

export function getFeedingLogsApi(
  babyId: string,
  date: string,
  idToken: string,
): Promise<FeedingLog[]> {
  return apiRequest<FeedingLog[]>(
    `/feeding?babyId=${encodeURIComponent(babyId)}&date=${encodeURIComponent(date)}`,
    {
      method: "GET",
      token: idToken,
    },
  );
}

export function createFeedingLogApi(
  data: CreateFeedingLogRequest,
  idToken: string,
): Promise<FeedingLog> {
  return apiRequest<FeedingLog>("/feeding", {
    method: "POST",
    token: idToken,
    body: JSON.stringify(data),
  });
}

export function updateFeedingLogApi(
  id: string,
  changes: UpdateFeedingLogRequest,
  idToken: string,
): Promise<FeedingLog> {
  return apiRequest<FeedingLog>(`/feeding/${id}`, {
    method: "PATCH",
    token: idToken,
    body: JSON.stringify(changes),
  });
}

export function deleteFeedingLogApi(
  id: string,
  idToken: string,
): Promise<void> {
  return apiRequest<void>(`/feeding/${id}`, {
    method: "DELETE",
    token: idToken,
  });
}
