import { useEffect } from "react";
import { Tabs, router } from "expo-router";
import { Text } from "react-native";

import { getAuthConnected } from "../../lib/auth-bridge";

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return <Text style={{ fontSize: 16, opacity: focused ? 1 : 0.58 }}>{label}</Text>;
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
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#08111f",
          borderTopColor: "rgba(255,255,255,0.08)",
          height: 84,
          paddingTop: 8,
          paddingBottom: 12,
        },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "rgba(255,255,255,0.54)",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen name="world" options={{ title: "월드", tabBarIcon: ({ focused }) => <TabIcon label="🌍" focused={focused} /> }} />
      <Tabs.Screen name="chat" options={{ title: "채팅", tabBarIcon: ({ focused }) => <TabIcon label="💬" focused={focused} /> }} />
      <Tabs.Screen name="people" options={{ title: "사람", tabBarIcon: ({ focused }) => <TabIcon label="👥" focused={focused} /> }} />
      <Tabs.Screen name="tasks" options={{ title: "할 일", tabBarIcon: ({ focused }) => <TabIcon label="✅" focused={focused} /> }} />
    </Tabs>
  );
}
