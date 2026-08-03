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
