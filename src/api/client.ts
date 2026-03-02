import { authStore } from "@/stores/auth";
import { AuthResponse } from "@/types/auth";

const BASE = import.meta.env.VITE_API_URL ?? "https://localhost:5000";

// Error class
export class ApiError extends Error {
  constructor(
    public status: number,
    public body: Record<string, string>,
  ) {
    super(body.detail ?? body.error ?? body.title ?? `HTTP ${status}`);
  }
}

// Generic Fetch
export async function req<T>(
  path: string,
  init: RequestInit = {},
  skipAuth = false,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init.headers as Record<string, string>) ?? {}),
  };

  if (!skipAuth && authStore.accessToken()) {
    headers["Authorization"] = `Bearer ${authStore.accessToken()}`;
  }

  let res = await fetch(`${BASE}${path}`, { ...init, headers });

  if (res.status === 401 && !skipAuth) {
    const ok = await tryRefreshToken();
    if (ok) {
      headers["Authorization"] = `Bearer ${authStore.accessToken()}`;
      res = await fetch(`${BASE}${path}`, { ...init, headers });
    } else {
      authStore.clear();
      throw new ApiError(401, { title: "Sessão expirada" });
    }
  }

  if (!res.ok)
    throw new ApiError(res.status, await res.json().catch(() => ({})));
  if (res.status === 204) return undefined as T;
  return res.json();
}

async function tryRefreshToken(): Promise<boolean> {
  const rt = authStore.refreshToken();
  if (!rt) return false;
  try {
    const d = await req<AuthResponse>(
      "/api/auth/refresh",
      { method: "POST", body: JSON.stringify({ refreshToken: rt }) },
      true,
    );
    authStore.setTokens(d.accessToken, d.refreshToken, d.user);
    return true;
  } catch {
    return false;
  }
}
