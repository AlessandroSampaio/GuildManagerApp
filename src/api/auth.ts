import type { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";
import type { ResetPasswordForm } from "@/schemas/resetPasswordSchema";
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
  refresh: (refreshToken: string) =>
    req<AuthResponse>(
      "/api/auth/refresh",
      { method: "POST", body: JSON.stringify({ refreshToken }) },
      true,
    ),
  resetPassword: (d: ResetPasswordForm) =>
    req<void>(
      "/api/auth/reset-password",
      {
        method: "POST",
        body: JSON.stringify(d),
      },
      true,
    ),
};
