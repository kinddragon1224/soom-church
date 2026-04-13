import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";

import { setAuthConnected } from "../../lib/auth-bridge";

function TaskRow({ title, due }: { title: string; due: string }) {
  return (
    <View style={{ borderRadius: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.05)", padding: 14 }}>
      <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>{title}</Text>
      <Text style={{ color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{due}</Text>
    </View>
  );
}

export default function TasksScreen() {
  const logout = async () => {
    await setAuthConnected(false);
    router.replace("/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#07111f" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120, gap: 12 }}>
        <Text style={{ color: "rgba(255,255,255,0.46)", fontSize: 11, letterSpacing: 2 }}>SOOM TASKS</Text>
        <Text style={{ color: "#fff", fontSize: 29, fontWeight: "700", lineHeight: 34 }}>오늘 할 일</Text>

        <TaskRow title="심방 대상 2명 확인" due="오늘" />
        <TaskRow title="기도요청 업데이트 반영" due="오늘" />
        <TaskRow title="주중 모임 공지 보내기" due="내일 오전" />

        <Pressable
          onPress={logout}
          style={{ marginTop: 8, minHeight: 50, borderRadius: 999, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", backgroundColor: "rgba(255,255,255,0.04)", alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>로그아웃(브리지 초기화)</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
