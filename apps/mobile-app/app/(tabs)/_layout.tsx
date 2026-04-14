import { useEffect } from "react";
import { Tabs, router } from "expo-router";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getAuthConnected } from "../../lib/auth-bridge";
import { mabiTheme } from "../../lib/ui-theme";
import { WorldStoreProvider } from "../../lib/world-store";

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return <Text style={{ fontSize: 13, opacity: focused ? 1 : 0.62 }}>{label}</Text>;
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const guard = async () => {
      const connected = await getAuthConnected();
      if (!connected) {
        router.replace("/login");
      }
    };

    guard();
  }, []);

  return (
    <WorldStoreProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#1f2b42",
            borderTopColor: "rgba(138,160,199,0.45)",
            borderTopWidth: 2,
            height: 56 + insets.bottom,
            paddingTop: 2,
            paddingBottom: Math.max(6, insets.bottom + 1),
          },
          tabBarItemStyle: {
            borderRadius: 8,
            marginHorizontal: 2,
            marginTop: 2,
          },
          tabBarActiveTintColor: mabiTheme.pixelInk,
          tabBarInactiveTintColor: "rgba(245,242,232,0.56)",
          tabBarLabelStyle: {
            fontSize: 9,
            fontWeight: "700",
            letterSpacing: 0.4,
          },
        }}
      >
        <Tabs.Screen name="world" options={{ title: "목양", tabBarIcon: ({ focused }) => <TabIcon label="🌍" focused={focused} /> }} />
        <Tabs.Screen name="chat" options={{ href: null }} />
        <Tabs.Screen name="people" options={{ title: "목원", tabBarIcon: ({ focused }) => <TabIcon label="👥" focused={focused} /> }} />
        <Tabs.Screen name="tasks" options={{ title: "기록", tabBarIcon: ({ focused }) => <TabIcon label="📝" focused={focused} /> }} />
      </Tabs>
    </WorldStoreProvider>
  );
}
