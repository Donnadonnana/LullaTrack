import { apiRequest } from "./apiClient";

import type { Baby, CreateBabyRequest, UpdateBabyRequest } from "../types/baby";

export function getBabiesApi(idToken: string): Promise<Baby[]> {
  return apiRequest<Baby[]>("/babies", {
    method: "GET",
    token: idToken,
  });
}

export function createBabyApi(
  data: CreateBabyRequest,
  idToken: string,
): Promise<Baby> {
  return apiRequest<Baby>("/babies", {
    method: "POST",
    token: idToken,
    body: JSON.stringify(data),
  });
}

export function updateBabyApi(
  babyId: string,
  data: UpdateBabyRequest,
  idToken: string,
): Promise<Baby> {
  return apiRequest<Baby>(`/babies/${babyId}`, {
    method: "PATCH",
    token: idToken,
    body: JSON.stringify(data),
  });
}
