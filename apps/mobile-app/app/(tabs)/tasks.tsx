import { useEffect, useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";

import { setAuthConnected } from "../../lib/auth-bridge";
import { fetchAgentGrowthLoops, type AgentGrowthLoop } from "../../lib/agent-growth-source";
import { mabiTheme } from "../../lib/ui-theme";
import { useWorldStore } from "../../lib/world-store";

function formatTime(value: string | number) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "방금";
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

export default function TasksScreen() {
  const { loading, snapshot, runtimeTasks, toggleRuntimeTask } = useWorldStore();
  const [growthLogs, setGrowthLogs] = useState<AgentGrowthLoop[]>([]);
  const [growthLoading, setGrowthLoading] = useState(false);

  const refreshLogs = async () => {
    setGrowthLoading(true);
    const loops = await fetchAgentGrowthLoops();
    setGrowthLogs(loops);
    setGrowthLoading(false);
  };

  useEffect(() => {
    refreshLogs();
  }, []);

  if (loading || !snapshot) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: mabiTheme.background, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: mabiTheme.textPrimary }}>기록 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  const doneCount = runtimeTasks.filter((task) => task.completed).length;
  const pendingCount = runtimeTasks.length - doneCount;
  const urgentCount = runtimeTasks.filter((task) => !task.completed && (task.title.includes("후속") || task.title.includes("심방") || task.title.includes("기도"))).length;

  const timeline = useMemo(() => {
    return [...runtimeTasks].sort((a, b) => b.createdAt - a.createdAt);
  }, [runtimeTasks]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: mabiTheme.background }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 100 }}>
        <Text style={{ color: mabiTheme.textMuted, fontSize: 11, letterSpacing: 1.5 }}>CARE RECORDS</Text>
        <Text style={{ color: mabiTheme.textPrimary, fontSize: 28, fontWeight: "700", marginTop: 4 }}>기록</Text>

        <View style={{ marginTop: 10, borderRadius: 12, borderWidth: 1, borderColor: "rgba(120,157,214,0.35)", backgroundColor: "rgba(20,29,45,0.92)", padding: 10, flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "rgba(243,208,128,0.45)", backgroundColor: "rgba(243,208,128,0.12)", padding: 8 }}>
            <Text style={{ color: "#ffeabf", fontSize: 10 }}>대기</Text>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 2 }}>{pendingCount}</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "rgba(143,224,170,0.45)", backgroundColor: "rgba(143,224,170,0.12)", padding: 8 }}>
            <Text style={{ color: "#d7ffe3", fontSize: 10 }}>완료</Text>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 2 }}>{doneCount}</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "rgba(242,168,168,0.45)", backgroundColor: "rgba(242,168,168,0.12)", padding: 8 }}>
            <Text style={{ color: "#ffd7d7", fontSize: 10 }}>긴급</Text>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 2 }}>{urgentCount}</Text>
          </View>
        </View>

        <View style={{ marginTop: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(120,157,214,0.35)", backgroundColor: "rgba(20,29,45,0.9)", padding: 10 }}>
          <Text style={{ color: "#a9c3ef", fontSize: 12, fontWeight: "700" }}>오늘 실행 로그</Text>
          <Text style={{ color: "rgba(220,232,255,0.66)", fontSize: 11, marginTop: 4 }}>모라 명령 결과로 생성된 실행 항목 타임라인</Text>

          <View style={{ marginTop: 8, gap: 7 }}>
            {timeline.length ? (
              timeline.slice(0, 12).map((task) => (
                <Pressable
                  key={task.id}
                  onPress={() => toggleRuntimeTask(task.id)}
                  style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: task.completed ? "rgba(143,224,170,0.45)" : "rgba(120,157,214,0.3)",
                    backgroundColor: task.completed ? "rgba(143,224,170,0.12)" : "rgba(255,255,255,0.04)",
                    padding: 9,
                    gap: 4,
                  }}
                >
                  <Text style={{ color: "#f4f7ff", fontSize: 13, fontWeight: "700" }}>{task.title}</Text>
                  <Text style={{ color: "rgba(216,230,255,0.72)", fontSize: 11 }}>{task.owner} · {task.due} · {formatTime(task.createdAt)}</Text>
                  <Text style={{ color: task.completed ? "#d7ffe3" : "#ffeabf", fontSize: 11 }}>{task.completed ? "완료됨(다시 누르면 미완료)" : "대기중(눌러서 완료 처리)"}</Text>
                </Pressable>
              ))
            ) : (
              <Text style={{ color: "rgba(220,232,255,0.56)", fontSize: 12 }}>아직 실행 로그가 없어. 월드에서 모라 명령을 한 번 실행해봐.</Text>
            )}
          </View>
        </View>

        <View style={{ marginTop: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(143,224,170,0.45)", backgroundColor: "rgba(12,35,24,0.45)", padding: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ color: "#d7ffe3", fontSize: 12, fontWeight: "700" }}>모라 자동 반영 로그</Text>
            <Pressable onPress={refreshLogs} style={{ borderRadius: 8, borderWidth: 1, borderColor: "rgba(143,224,170,0.5)", paddingHorizontal: 8, paddingVertical: 4 }}>
              <Text style={{ color: "#d7ffe3", fontSize: 11 }}>새로고침</Text>
            </Pressable>
          </View>

          <View style={{ marginTop: 8, gap: 7 }}>
            {growthLoading ? (
              <Text style={{ color: "rgba(216,255,229,0.72)", fontSize: 12 }}>불러오는 중...</Text>
            ) : growthLogs.length ? (
              growthLogs.slice(0, 8).map((loop) => (
                <View key={loop.id} style={{ borderRadius: 10, borderWidth: 1, borderColor: "rgba(143,224,170,0.35)", backgroundColor: "rgba(255,255,255,0.04)", padding: 9 }}>
                  <Text style={{ color: "#d8ffe5", fontSize: 11, fontWeight: "700" }}>{formatTime(loop.createdAt)} · {loop.agentGrowth?.title ?? "Agent Loop"}</Text>
                  <Text style={{ color: "rgba(216,255,229,0.82)", fontSize: 11, marginTop: 4 }}>{loop.agentGrowth?.summary ?? "요약 없음"}</Text>
                  {loop.dbActions?.applied ? (
                    <Text style={{ color: "rgba(216,255,229,0.72)", fontSize: 10, marginTop: 3 }}>
                      DB 반영: {(loop.dbActions.updatedMembers ?? []).join(", ")} · {loop.dbActions.statusTag ?? "상태 갱신"}
                    </Text>
                  ) : null}
                </View>
              ))
            ) : (
              <Text style={{ color: "rgba(216,255,229,0.7)", fontSize: 12 }}>아직 자동 반영 로그가 없어.</Text>
            )}
          </View>
        </View>

        <Pressable
          onPress={async () => {
            await setAuthConnected(false);
            router.replace("/login");
          }}
          style={{
            marginTop: 16,
            minHeight: 44,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "rgba(242,168,168,0.45)",
            backgroundColor: "rgba(242,168,168,0.14)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#ffd7d7", fontWeight: "700" }}>로그아웃</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
