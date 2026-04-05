/**
 * Session restoration for the "remember me" feature.
 * Kept separate from auth.ts to avoid a circular dependency:
 *   auth.ts → api/client.ts → auth.ts
 */
import { authStore } from "@/stores/auth";
import { clearRefreshToken, loadRefreshToken } from "@/lib/stronghold";
import { authApi } from "@/api/auth";

export async function tryRestoreSession(): Promise<boolean> {
  if (!authStore.isRemembered()) {
    console.log("[session] no saved session — skipping restore");
    return false;
  }

  console.log("[session] found remember-me flag, loading token from stronghold...");
  const rt = await loadRefreshToken();
  if (!rt) {
    console.warn("[session] no token found in stronghold, clearing remember-me flag");
    authStore.setRemembered(false);
    return false;
  }

  console.log("[session] token loaded, attempting refresh...");
  try {
    const data = await authApi.refresh(rt);
    authStore.setTokens(data.accessToken, data.refreshToken, data.user);
    console.log("[session] session restored", { user: data.user.username, role: data.user.role });
    return true;
  } catch (err) {
    console.error("[session] token refresh failed, clearing saved session", err);
    authStore.setRemembered(false);
    await clearRefreshToken();
    return false;
  }
}
