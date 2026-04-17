import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_CONNECTED_KEY = "soom.mobile.auth.connected";
const CHURCH_SLUG_KEY = "soom.mobile.auth.churchSlug";
const ACCOUNT_KEY = "soom.mobile.auth.accountKey";
const ACCOUNT_KEY_BACKUP = "soom.mobile.auth.accountKey.backup";

function normalizeSlug(value: string | null | undefined) {
  if (!value) return null;
  const slug = value.trim().toLowerCase();
  return slug.length > 0 ? slug : null;
}

function normalizeAccountKey(value: string | null | undefined) {
  if (!value) return null;
  const key = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .slice(0, 80);
  return key.length > 0 ? key : null;
}

export async function getAuthConnected() {
  const value = await AsyncStorage.getItem(AUTH_CONNECTED_KEY);
  return value === "1";
}

export async function setAuthConnected(connected: boolean) {
  if (connected) {
    await AsyncStorage.setItem(AUTH_CONNECTED_KEY, "1");
    return;
  }

  await AsyncStorage.multiRemove([AUTH_CONNECTED_KEY, CHURCH_SLUG_KEY, ACCOUNT_KEY, ACCOUNT_KEY_BACKUP]);
}

export async function getCurrentChurchSlug() {
  const value = await AsyncStorage.getItem(CHURCH_SLUG_KEY);
  return normalizeSlug(value);
}

export async function setCurrentChurchSlug(churchSlug: string | null | undefined) {
  const normalized = normalizeSlug(churchSlug);

  if (!normalized) {
    await AsyncStorage.removeItem(CHURCH_SLUG_KEY);
    return;
  }

  await AsyncStorage.setItem(CHURCH_SLUG_KEY, normalized);
}

export async function getCurrentAccountKey() {
  const value = await AsyncStorage.getItem(ACCOUNT_KEY);
  const normalized = normalizeAccountKey(value);
  if (normalized) return normalized;

  const backup = await AsyncStorage.getItem(ACCOUNT_KEY_BACKUP);
  const normalizedBackup = normalizeAccountKey(backup);
  if (!normalizedBackup) return null;

  await AsyncStorage.setItem(ACCOUNT_KEY, normalizedBackup);
  return normalizedBackup;
}

export async function getRequiredAccountKey() {
  const accountKey = await getCurrentAccountKey();
  if (!accountKey) {
    throw new Error("ACCOUNT_LOGIN_REQUIRED");
  }
  return accountKey;
}

export async function setCurrentAccountKey(accountKey: string | null | undefined) {
  const normalized = normalizeAccountKey(accountKey);

  if (!normalized) {
    await AsyncStorage.multiRemove([ACCOUNT_KEY, ACCOUNT_KEY_BACKUP]);
    return;
  }

  await AsyncStorage.multiSet([
    [ACCOUNT_KEY, normalized],
    [ACCOUNT_KEY_BACKUP, normalized],
  ]);
}
