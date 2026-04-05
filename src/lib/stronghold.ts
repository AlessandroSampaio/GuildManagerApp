import { Client, Stronghold } from "@tauri-apps/plugin-stronghold";
import { appDataDir, join } from "@tauri-apps/api/path";
import { exists } from "@tauri-apps/plugin-fs";

const VAULT_PASSWORD = "guild_manager_v1_stronghold";
const CLIENT_NAME = "auth";
const REFRESH_TOKEN_KEY = "refresh_token";

async function getVaultPath(): Promise<string> {
  const dir = await appDataDir();
  const path = await join(dir, "auth.vault");
  console.log("[stronghold] vault path resolved:", path);
  return path;
}

async function getStore(): Promise<{ store: ReturnType<Client["getStore"]>; stronghold: Stronghold; vaultPath: string }> {
  const vaultPath = await getVaultPath();

  const vaultExists = await exists(vaultPath).catch(() => false);
  console.log("[stronghold] vault file exists before load:", vaultExists);

  const stronghold = await Stronghold.load(vaultPath, VAULT_PASSWORD);
  console.log("[stronghold] vault loaded");

  let client: Client;
  try {
    client = await stronghold.loadClient(CLIENT_NAME);
    console.log("[stronghold] client loaded:", CLIENT_NAME);
  } catch (err) {
    console.warn("[stronghold] loadClient failed — creating new client. Reason:", err);
    client = await stronghold.createClient(CLIENT_NAME);
    console.log("[stronghold] client created:", CLIENT_NAME);
  }

  return { store: client.getStore(), stronghold, vaultPath };
}

export async function saveRefreshToken(token: string): Promise<void> {
  console.log("[stronghold] saveRefreshToken: start");
  try {
    const { store, stronghold, vaultPath } = await getStore();
    const bytes = Array.from(new TextEncoder().encode(token));
    console.log("[stronghold] saveRefreshToken: inserting", bytes.length, "bytes");
    await store.insert(REFRESH_TOKEN_KEY, bytes);
    console.log("[stronghold] saveRefreshToken: insert ok — calling save()");
    await stronghold.save();

    const savedOk = await exists(vaultPath).catch(() => false);
    console.log("[stronghold] saveRefreshToken: vault file exists after save:", savedOk);
    console.log("[stronghold] saveRefreshToken: complete");
  } catch (err) {
    console.error("[stronghold] saveRefreshToken: FAILED", err);
    throw err;
  }
}

export async function loadRefreshToken(): Promise<string | null> {
  console.log("[stronghold] loadRefreshToken: start");
  try {
    const { store } = await getStore();
    const bytes = await store.get(REFRESH_TOKEN_KEY);
    if (!bytes || bytes.length === 0) {
      console.warn("[stronghold] loadRefreshToken: key not found or empty — token was never saved or save failed");
      return null;
    }
    const token = new TextDecoder().decode(new Uint8Array(bytes));
    console.log("[stronghold] loadRefreshToken: token found,", bytes.length, "bytes");
    return token;
  } catch (err) {
    console.error("[stronghold] loadRefreshToken: FAILED", err);
    return null;
  }
}

export async function clearRefreshToken(): Promise<void> {
  console.log("[stronghold] clearRefreshToken: start");
  try {
    const { store, stronghold } = await getStore();
    await store.remove(REFRESH_TOKEN_KEY);
    await stronghold.save();
    console.log("[stronghold] clearRefreshToken: cleared and saved");
  } catch (err) {
    console.warn("[stronghold] clearRefreshToken: failed (vault may not exist yet)", err);
  }
}
