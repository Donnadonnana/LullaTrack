import { apiRequest } from "./apiClient";

import type {
  GetMeResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth";

export function registerUser(data: RegisterRequest): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function loginUser(data: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getCurrentUser(idToken: string): Promise<GetMeResponse> {
  return apiRequest<GetMeResponse>("/users/me", {
    method: "GET",
    token: idToken,
  });
}
const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

type RefreshTokenResponse = {
  id_token: string;
  refresh_token: string;
  expires_in: string;
  user_id: string;
};

export async function refreshAuthToken(refreshToken: string): Promise<{
  idToken: string;
  refreshToken: string;
  expiresIn: number;
}> {
  const response = await fetch(
    `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Unable to refresh authentication token.");
  }

  const data = (await response.json()) as RefreshTokenResponse;

  return {
    idToken: data.id_token,
    refreshToken: data.refresh_token,
    expiresIn: Number(data.expires_in),
  };
}
