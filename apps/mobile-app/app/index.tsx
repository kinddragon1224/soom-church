import { useEffect } from "react";
import { ActivityIndicator, SafeAreaView, View } from "react-native";
import { router } from "expo-router";

import { getAuthConnected } from "../lib/auth-bridge";

export default function IndexScreen() {
  useEffect(() => {
    const run = async () => {
      const connected = await getAuthConnected();
      router.replace(connected ? "/(tabs)/world" : "/login");
    };

    run();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#07111f" }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#fff" />
      </View>
    </SafeAreaView>
  );
}
