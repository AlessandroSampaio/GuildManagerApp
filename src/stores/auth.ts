import { UserInfo } from "@/types/auth";
import { createSignal } from "solid-js";

const KEY = "wcl_auth";

function load() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "null");
  } catch (error) {
    return null;
  }
}

function save(v: object | null) {
  try {
    v
      ? sessionStorage.setItem(KEY, JSON.stringify(v))
      : sessionStorage.removeItem(KEY);
  } catch (error) {
    console.error(error);
  }
}

const s = load();
const [accessToken, setAccessToken] = createSignal<string | null>(
  s?.accessToken ?? null,
);
const [refreshToken, setRefreshToken] = createSignal<string | null>(
  s?.refreshToken ?? null,
);
const [user, setUser] = createSignal<UserInfo | null>(s?.user ?? null);
const [wclAuthorized, setWclAuthorized] = createSignal<boolean>(false);

function setTokens(access: string, refresh: string, userInfo: UserInfo) {
  setAccessToken(access);
  setRefreshToken(refresh);
  setUser(userInfo);
  save({ accessToken: access, refreshToken: refresh, user: userInfo });
}

function clear() {
  setAccessToken(null);
  setRefreshToken(null);
  setUser(null);
  setWclAuthorized(false);
  save(null);
}

export const authStore = {
  accessToken,
  refreshToken,
  user,
  wclAuthorized,
  setWclAuthorized,
  setTokens,
  clear,
  isAuthenticated: () => !!accessToken(),
};
