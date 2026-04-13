import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_CONNECTED_KEY = "soom.mobile.auth.connected";
const CHURCH_SLUG_KEY = "soom.mobile.auth.churchSlug";

function normalizeSlug(value: string | null | undefined) {
  if (!value) return null;
  const slug = value.trim().toLowerCase();
  return slug.length > 0 ? slug : null;
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

  await AsyncStorage.multiRemove([AUTH_CONNECTED_KEY, CHURCH_SLUG_KEY]);
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
