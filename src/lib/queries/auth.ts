import { authApi } from "@/api/auth";
import { authStore } from "@/stores/auth";
import { useMutation } from "@tanstack/solid-query";

/**
 * Change the local user password.
 * onSuccess → clears the auth store (forces re-login with new credentials).
 */
export function useChangePassword() {
  return useMutation(() => ({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(payload),
    onSuccess: () => {
      authStore.clear();
    },
  }));
}
