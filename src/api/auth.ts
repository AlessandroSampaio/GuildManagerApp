import type { AuthResponse, LoginRequest } from "@/types/auth";
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
  logout: (refreshToken: string) =>
    req<void>("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),
};
