import { useEffect } from "react";
import { Tabs, router } from "expo-router";
import { Text } from "react-native";

import { getAuthConnected } from "../../lib/auth-bridge";
import { mabiTheme } from "../../lib/ui-theme";
import { WorldStoreProvider } from "../../lib/world-store";

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return <Text style={{ fontSize: 15, opacity: focused ? 1 : 0.62 }}>{label}</Text>;
}

export default function TabsLayout() {
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
            height: 86,
            paddingTop: 8,
            paddingBottom: 12,
          },
          tabBarItemStyle: {
            borderRadius: 8,
            marginHorizontal: 2,
            marginTop: 2,
          },
          tabBarActiveTintColor: mabiTheme.pixelInk,
          tabBarInactiveTintColor: "rgba(245,242,232,0.56)",
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "700",
            letterSpacing: 0.4,
          },
        }}
      >
        <Tabs.Screen name="world" options={{ title: "월드", tabBarIcon: ({ focused }) => <TabIcon label="🌍" focused={focused} /> }} />
        <Tabs.Screen name="chat" options={{ title: "채팅", tabBarIcon: ({ focused }) => <TabIcon label="💬" focused={focused} /> }} />
        <Tabs.Screen name="people" options={{ title: "사람", tabBarIcon: ({ focused }) => <TabIcon label="👥" focused={focused} /> }} />
        <Tabs.Screen name="tasks" options={{ title: "할 일", tabBarIcon: ({ focused }) => <TabIcon label="✅" focused={focused} /> }} />
      </Tabs>
    </WorldStoreProvider>
  );
}
