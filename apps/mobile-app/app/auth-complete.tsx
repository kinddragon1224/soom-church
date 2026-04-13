import { useEffect } from "react";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { setAuthConnected, setCurrentChurchSlug } from "../lib/auth-bridge";

export default function AuthCompleteScreen() {
  const params = useLocalSearchParams<{ churchSlug?: string }>();

  useEffect(() => {
    const run = async () => {
      await setCurrentChurchSlug(typeof params.churchSlug === "string" ? params.churchSlug : null);
      await setAuthConnected(true);
      router.replace("/(tabs)/world");
    };

    run();
  }, [params.churchSlug]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#07111f" }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 14 }}>
        <ActivityIndicator color="#fff" />
        <Text style={{ color: "#fff", fontSize: 15 }}>로그인 연결 중...</Text>
      </View>
    </SafeAreaView>
  );
}
