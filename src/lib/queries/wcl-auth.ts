import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/solid-query";
import { wclAuthApi } from "@/api/wcl-auth";
import { wclKeys } from "../query-keys";
import { authStore } from "@/stores/auth";

/** WCL OAuth status for the authenticated user. Short staleTime — changes after OAuth flow. */
export const wclStatusOptions = () =>
  queryOptions({
    queryKey: wclKeys.status(),
    queryFn: () => wclAuthApi.getStatus(),
    staleTime: 30 * 1000,
    retry: 1,
  });

/**
 * WCL OAuth status.
 * Syncs `authStore.wclAuthorized` reactively whenever data arrives or refreshes.
 */
export function useWclStatus() {
  return useQuery(() => ({
    ...wclStatusOptions(),
    select: (data) => {
      authStore.setWclAuthorized(data.isAuthorized);
      return data;
    },
  }));
}

/**
 * Revoke the WCL OAuth token.
 * onSuccess → clears auth store flag + invalidates wcl status query.
 */
export function useRevokeWcl() {
  const qc = useQueryClient();
  return useMutation(() => ({
    mutationFn: () => wclAuthApi.revoke(),
    onSuccess: () => {
      authStore.setWclAuthorized(false);
      // Write optimistic false into cache immediately, then refetch
      qc.setQueryData(wclKeys.status(), (old: any) =>
        old ? { ...old, isAuthorized: false } : old,
      );
      qc.invalidateQueries({ queryKey: wclKeys.status() });
    },
  }));
}
