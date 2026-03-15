import type { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";
import { req } from "./client";

export const authApi = {
  login: (d: LoginRequest) =>
    req<AuthResponse>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify(d),
      },
      true,
    ),
  register: (d: RegisterRequest) =>
    req<AuthResponse>(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify(d),
      },
      true,
    ),
  logout: (refreshToken: string) =>
    req<void>("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),
  changePassword: (d: { currentPassword: string; newPassword: string }) =>
    req<void>("/api/auth/change-password", {
      method: "PATCH",
      body: JSON.stringify(d),
    }),
};
