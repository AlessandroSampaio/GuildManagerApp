/**
 * QueryClient singleton for @tanstack/solid-query v5.
 *
 * Retry policy: never retry on 401 (auth expired) or 404 (not found).
 * All other errors retry up to 2 times with exponential back-off.
 *
 * staleTime per namespace:
 *   reports list / detail  → 5 min   (changes only when user imports)
 *   report performance     → 10 min  (immutable after import)
 *   wcl status             → 30 s    (can change after OAuth flow)
 */

import { ApiError } from "@/api/client";
import { QueryClient } from "@tanstack/solid-query";

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (
    error instanceof ApiError &&
    (error.status === 401 || error.status === 404)
  ) {
    return false;
  }
  return failureCount < 2;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      staleTime: 5 * 60 * 1000, // 5 min default
      gcTime: 10 * 60 * 1000, // 10 min in-memory cache
      refetchOnWindowFocus: false, // desktop app — no window focus events
    },
    mutations: {
      retry: false,
    },
  },
});
