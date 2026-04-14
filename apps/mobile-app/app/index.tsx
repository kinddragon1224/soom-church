import { useEffect } from "react";
import { ActivityIndicator, SafeAreaView, View } from "react-native";
import { router } from "expo-router";

import { getAuthConnected } from "../lib/auth-bridge";
import { getWorldSetupState } from "../lib/world-setup";

export default function IndexScreen() {
  useEffect(() => {
    const run = async () => {
      const connected = await getAuthConnected();
      if (!connected) {
        router.replace("/login");
        return;
      }

      const setup = await getWorldSetupState();
      router.replace(setup?.completed ? "/(tabs)/world" : "/world-setup");
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
