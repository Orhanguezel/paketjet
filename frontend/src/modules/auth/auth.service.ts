import { apiGet, apiPost } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";
import type { User, LoginInput, RegisterInput, AuthResponse } from "./auth.type";

export function login(data: LoginInput): Promise<AuthResponse> {
  return apiPost<AuthResponse>(API.auth.login, {
    email: data.email,
    password: data.password,
    grant_type: "password",
  });
}

export function register(data: RegisterInput): Promise<AuthResponse> {
  const { role, ...rest } = data;
  return apiPost<AuthResponse>(API.auth.register, {
    ...rest,
    options: { data: { role: role === "carrier" ? "carrier" : undefined } },
  });
}

export function logout(): Promise<{ ok: boolean }> {
  return apiPost<{ ok: boolean }>(API.auth.logout);
}

export function getMe(): Promise<User> {
  return apiGet<User>(API.auth.me);
}

export function forgotPassword(email: string): Promise<{ success: boolean; token?: string }> {
  return apiPost<{ success: boolean; token?: string }>(API.auth.forgotPassword, { email });
}

export function resetPassword(token: string, password: string): Promise<{ success: boolean }> {
  return apiPost<{ success: boolean }>(API.auth.resetPassword, { token, password });
}
