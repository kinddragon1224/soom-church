import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_CONNECTED_KEY = "soom.mobile.auth.connected";

export async function getAuthConnected() {
  const value = await AsyncStorage.getItem(AUTH_CONNECTED_KEY);
  return value === "1";
}

export async function setAuthConnected(connected: boolean) {
  if (connected) {
    await AsyncStorage.setItem(AUTH_CONNECTED_KEY, "1");
    return;
  }
  await AsyncStorage.removeItem(AUTH_CONNECTED_KEY);
}
