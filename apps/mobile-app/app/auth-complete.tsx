import { useEffect } from "react";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";
import { router } from "expo-router";

import { setAuthConnected } from "../lib/auth-bridge";

export default function AuthCompleteScreen() {
  useEffect(() => {
    const run = async () => {
      await setAuthConnected(true);
      router.replace("/(tabs)/world");
    };

    run();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#07111f" }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 14 }}>
        <ActivityIndicator color="#fff" />
        <Text style={{ color: "#fff", fontSize: 15 }}>로그인 연결 중...</Text>
      </View>
    </SafeAreaView>
  );
}
