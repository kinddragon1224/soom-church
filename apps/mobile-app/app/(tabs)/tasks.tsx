import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";

import { setAuthConnected } from "../../lib/auth-bridge";
import { mabiTheme } from "../../lib/ui-theme";
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
        borderRadius: 12,
        borderWidth: 2,
        borderColor: done ? "rgba(143,224,170,0.6)" : runtime ? "rgba(243,208,128,0.6)" : mabiTheme.pixelBorder,
        backgroundColor: done ? "rgba(143,224,170,0.12)" : runtime ? "rgba(243,208,128,0.1)" : mabiTheme.pixelPanel,
        padding: 12,
        opacity: done ? 0.85 : 1,
      }}
    >
      {runtime ? <Text style={{ color: done ? mabiTheme.pixelSuccess : mabiTheme.pixelAccent, fontSize: 11, fontWeight: "700" }}>{done ? "완료됨" : "채팅에서 추가됨"}</Text> : null}
      <Text style={{ color: mabiTheme.pixelInk, fontSize: 15, fontWeight: "700", marginTop: runtime ? 4 : 0, textDecorationLine: done ? "line-through" : "none" }}>{title}</Text>
      <Text style={{ color: "rgba(245,242,232,0.68)", marginTop: 4 }}>{due}</Text>
      <Text style={{ color: "rgba(245,242,232,0.52)", marginTop: 4, fontSize: 12 }}>담당: {owner}</Text>
      {onToggle ? <Text style={{ color: "rgba(245,242,232,0.55)", marginTop: 6, fontSize: 11 }}>{done ? "다시 누르면 미완료" : "눌러서 완료 처리"}</Text> : null}
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
    <SafeAreaView style={{ flex: 1, backgroundColor: mabiTheme.background }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120, gap: 12 }}>
        <Text style={{ color: mabiTheme.textMuted, fontSize: 11, letterSpacing: 2 }}>SOOM TASKS</Text>
        <Text style={{ color: mabiTheme.textPrimary, fontSize: 29, fontWeight: "700", lineHeight: 34 }}>타이쿤 실행 목록</Text>

        {runtimeTasks.length ? (
          <View style={{ borderRadius: 10, borderWidth: 2, borderColor: "rgba(243,208,128,0.5)", backgroundColor: "rgba(243,208,128,0.14)", padding: 10 }}>
            <Text style={{ color: mabiTheme.pixelAccent, fontSize: 12, fontWeight: "700" }}>실행 대기 {runtimeTodo.length} · 완료 {runtimeDone.length}</Text>
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
          style={{ marginTop: 8, minHeight: 48, borderRadius: 10, borderWidth: 2, borderColor: "rgba(242,168,168,0.45)", backgroundColor: "rgba(242,168,168,0.15)", alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: "#ffe8e8", fontWeight: "700" }}>로그아웃(브리지 초기화)</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
