import { UserInfo } from "@/types/auth";
import { createSignal } from "solid-js";
import { clearRefreshToken, saveRefreshToken } from "@/lib/stronghold";

const SESSION_KEY = "wcl_auth";
const REMEMBER_KEY = "wcl_auth_remember";

function load() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? "null");
  } catch {
    return null;
  }
}

function save(v: object | null) {
  try {
    v
      ? sessionStorage.setItem(SESSION_KEY, JSON.stringify(v))
      : sessionStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error(e);
  }
}

const s = load();
const [accessToken, setAccessToken] = createSignal<string | null>(s?.accessToken ?? null);
const [refreshToken, setRefreshToken] = createSignal<string | null>(s?.refreshToken ?? null);
const [user, setUser] = createSignal<UserInfo | null>(s?.user ?? null);
const [wclAuthorized, setWclAuthorized] = createSignal<boolean>(false);

/** Whether the user chose "remember me" on their last login. */
function isRemembered(): boolean {
  return localStorage.getItem(REMEMBER_KEY) === "true";
}

function setRemembered(value: boolean) {
  if (value) localStorage.setItem(REMEMBER_KEY, "true");
  else localStorage.removeItem(REMEMBER_KEY);
}

/**
 * Sync in-memory + sessionStorage update.
 * Also fires a fire-and-forget stronghold update when "remember me" is active,
 * so the refresh token stays current after automatic 401 token rotations.
 */
function setTokens(access: string, refresh: string, userInfo: UserInfo) {
  setAccessToken(access);
  setRefreshToken(refresh);
  setUser(userInfo);
  save({ accessToken: access, refreshToken: refresh, user: userInfo });
  if (isRemembered()) {
    saveRefreshToken(refresh).catch(console.error);
  }
}

/**
 * Login path — use this from the login form.
 * In-memory state is updated synchronously so navigation can proceed immediately.
 * Stronghold writes are fire-and-forget and never block or throw to the caller.
 */
function loginWithRemember(
  access: string,
  refresh: string,
  userInfo: UserInfo,
  rememberMe: boolean,
) {
  setAccessToken(access);
  setRefreshToken(refresh);
  setUser(userInfo);
  save({ accessToken: access, refreshToken: refresh, user: userInfo });
  setRemembered(rememberMe);
  if (rememberMe) {
    saveRefreshToken(refresh).catch(console.error);
  } else {
    clearRefreshToken().catch(() => { /* vault may not exist yet */ });
  }
}

function clear() {
  setAccessToken(null);
  setRefreshToken(null);
  setUser(null);
  setWclAuthorized(false);
  save(null);
  setRemembered(false);
  clearRefreshToken().catch(console.error);
}

export const authStore = {
  accessToken,
  refreshToken,
  user,
  wclAuthorized,
  setWclAuthorized,
  setTokens,
  loginWithRemember,
  clear,
  isAuthenticated: () => !!accessToken(),
  isRemembered,
  setRemembered,
};
