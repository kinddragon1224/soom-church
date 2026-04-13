import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";

import { setAuthConnected } from "../../lib/auth-bridge";
import { useWorldStore } from "../../lib/world-store";

function TaskRow({
  title,
  due,
  owner,
  runtime,
  completed,
  onToggle,
}: {
  title: string;
  due: string;
  owner: string;
  runtime?: boolean;
  completed?: boolean;
  onToggle?: () => void;
}) {
  const done = Boolean(completed);

  return (
    <Pressable
      onPress={onToggle}
      disabled={!onToggle}
      style={{
        borderRadius: 18,
        borderWidth: 1,
        borderColor: done ? "rgba(74,222,128,0.35)" : runtime ? "rgba(125,211,252,0.4)" : "rgba(255,255,255,0.08)",
        backgroundColor: done ? "rgba(34,197,94,0.12)" : runtime ? "rgba(56,189,248,0.08)" : "rgba(255,255,255,0.05)",
        padding: 14,
        opacity: done ? 0.82 : 1,
      }}
    >
      {runtime ? <Text style={{ color: done ? "#86efac" : "#7dd3fc", fontSize: 11, fontWeight: "700" }}>{done ? "완료됨" : "채팅에서 추가됨"}</Text> : null}
      <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600", marginTop: runtime ? 4 : 0, textDecorationLine: done ? "line-through" : "none" }}>{title}</Text>
      <Text style={{ color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{due}</Text>
      <Text style={{ color: "rgba(255,255,255,0.48)", marginTop: 4, fontSize: 12 }}>담당: {owner}</Text>
      {onToggle ? <Text style={{ color: "rgba(255,255,255,0.55)", marginTop: 6, fontSize: 11 }}>{done ? "다시 누르면 미완료로 변경" : "눌러서 완료 처리"}</Text> : null}
    </Pressable>
  );
}

export default function TasksScreen() {
  const { loading, snapshot, runtimeTasks, toggleRuntimeTask } = useWorldStore();

  const logout = async () => {
    await setAuthConnected(false);
    router.replace("/login");
  };

  const runtimeTodo = runtimeTasks.filter((task) => !task.completed);
  const runtimeDone = runtimeTasks.filter((task) => task.completed);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#07111f" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120, gap: 12 }}>
        <Text style={{ color: "rgba(255,255,255,0.46)", fontSize: 11, letterSpacing: 2 }}>SOOM TASKS</Text>
        <Text style={{ color: "#fff", fontSize: 29, fontWeight: "700", lineHeight: 34 }}>오늘 할 일</Text>

        {runtimeTasks.length ? (
          <View style={{ borderRadius: 16, borderWidth: 1, borderColor: "rgba(125,211,252,0.25)", backgroundColor: "rgba(56,189,248,0.08)", padding: 12 }}>
            <Text style={{ color: "#dff4ff", fontSize: 12 }}>실행 대기 {runtimeTodo.length} · 완료 {runtimeDone.length}</Text>
          </View>
        ) : null}

        {runtimeTodo.map((task) => (
          <TaskRow key={task.id} title={task.title} due={task.due} owner={task.owner} runtime completed={task.completed} onToggle={() => toggleRuntimeTask(task.id)} />
        ))}

        {runtimeDone.map((task) => (
          <TaskRow key={task.id} title={task.title} due={task.due} owner={task.owner} runtime completed={task.completed} onToggle={() => toggleRuntimeTask(task.id)} />
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
