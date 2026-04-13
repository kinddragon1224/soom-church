import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";

import { setAuthConnected } from "../../lib/auth-bridge";
import { useWorldStore } from "../../lib/world-store";

function TaskRow({ title, due, owner, runtime }: { title: string; due: string; owner: string; runtime?: boolean }) {
  return (
    <View style={{ borderRadius: 18, borderWidth: 1, borderColor: runtime ? "rgba(125,211,252,0.4)" : "rgba(255,255,255,0.08)", backgroundColor: runtime ? "rgba(56,189,248,0.08)" : "rgba(255,255,255,0.05)", padding: 14 }}>
      {runtime ? <Text style={{ color: "#7dd3fc", fontSize: 11, fontWeight: "700" }}>채팅에서 추가됨</Text> : null}
      <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600", marginTop: runtime ? 4 : 0 }}>{title}</Text>
      <Text style={{ color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{due}</Text>
      <Text style={{ color: "rgba(255,255,255,0.48)", marginTop: 4, fontSize: 12 }}>담당: {owner}</Text>
    </View>
  );
}

export default function TasksScreen() {
  const { loading, snapshot, runtimeTasks } = useWorldStore();

  const logout = async () => {
    await setAuthConnected(false);
    router.replace("/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#07111f" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120, gap: 12 }}>
        <Text style={{ color: "rgba(255,255,255,0.46)", fontSize: 11, letterSpacing: 2 }}>SOOM TASKS</Text>
        <Text style={{ color: "#fff", fontSize: 29, fontWeight: "700", lineHeight: 34 }}>오늘 할 일</Text>

        {runtimeTasks.map((task) => (
          <TaskRow key={task.id} title={task.title} due={task.due} owner={task.owner} runtime />
        ))}

        {loading || !snapshot ? (
          <Text style={{ color: "rgba(255,255,255,0.7)" }}>할 일 데이터를 불러오는 중...</Text>
        ) : (
          snapshot.taskRecords.map((task) => <TaskRow key={task.id} title={task.title} due={task.due} owner={task.owner} />)
        )}

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
