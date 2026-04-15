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
  const { loading, snapshot, runtimeTasks, toggleRuntimeTask, attendanceReward, refreshAttendance } = useWorldStore();
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

  const doneCount = runtimeTasks.filter((task) => task.completed).length;
  const pendingCount = runtimeTasks.length - doneCount;
  const urgentCount = runtimeTasks.filter((task) => !task.completed && (task.title.includes("후속") || task.title.includes("심방") || task.title.includes("기도"))).length;

  const timeline = useMemo(() => {
    return [...runtimeTasks].sort((a, b) => b.createdAt - a.createdAt);
  }, [runtimeTasks]);

  if (loading || !snapshot) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: mabiTheme.background, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: mabiTheme.textPrimary }}>기록 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 100 }}>
        <Text style={{ color: "rgba(230,230,230,0.56)", fontSize: 11, letterSpacing: 1.5 }}>MINISTRY RECORDS</Text>
        <Text style={{ color: "#f5f5f5", fontSize: 28, fontWeight: "700", marginTop: 4 }}>기록</Text>

        <View style={{ marginTop: 10, borderRadius: 12, borderWidth: 1, borderColor: "#2a2a2a", backgroundColor: "#141414", padding: 10, flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "#8a7b54", backgroundColor: "#211d14", padding: 8 }}>
            <Text style={{ color: "#e3d4ab", fontSize: 10 }}>대기</Text>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 2 }}>{pendingCount}</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "#5aa36f", backgroundColor: "#152419", padding: 8 }}>
            <Text style={{ color: "#c7f0d3", fontSize: 10 }}>완료</Text>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 2 }}>{doneCount}</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "#c95c5c", backgroundColor: "#2a1515", padding: 8 }}>
            <Text style={{ color: "#f1c2c2", fontSize: 10 }}>긴급</Text>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 2 }}>{urgentCount}</Text>
          </View>
        </View>

        <View style={{ marginTop: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(120,157,214,0.45)", backgroundColor: "rgba(24,32,46,0.55)", padding: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: "#d8e7ff", fontSize: 12, fontWeight: "700" }}>출석 현황</Text>
            <Pressable onPress={refreshAttendance} style={{ borderRadius: 8, borderWidth: 1, borderColor: "rgba(120,157,214,0.5)", paddingHorizontal: 8, paddingVertical: 4 }}>
              <Text style={{ color: "#d8e7ff", fontSize: 11 }}>갱신</Text>
            </Pressable>
          </View>
          <Text style={{ color: "rgba(216,231,255,0.86)", fontSize: 11, marginTop: 6 }}>
            총 접속 {attendanceReward?.totalAttendanceDays ?? 0}일차 · 연속 {attendanceReward?.streakCount ?? 0}일
          </Text>
          <Text style={{ color: "rgba(216,231,255,0.74)", fontSize: 10, marginTop: 3 }}>
            {attendanceReward?.lastAttendanceDate ? `최근 출석 ${attendanceReward.lastAttendanceDate}` : "최근 출석 기록 없음"}
            {" · "}
            {attendanceReward?.lastCheckWasConsecutive ? "연속 출석 유지" : "연속 출석 재시작/미유지"}
          </Text>
        </View>

        <View style={{ marginTop: 12, borderRadius: 12, borderWidth: 1, borderColor: "#2f2f2f", backgroundColor: "#131313", padding: 10 }}>
          <Text style={{ color: "#d8d8d8", fontSize: 12, fontWeight: "700" }}>오늘 실행 로그</Text>
          <Text style={{ color: "rgba(245,245,245,0.6)", fontSize: 11, marginTop: 4 }}>모라 명령 결과로 생성된 실행 항목 타임라인</Text>

          <View style={{ marginTop: 8, gap: 7 }}>
            {timeline.length ? (
              timeline.slice(0, 12).map((task) => (
                <Pressable
                  key={task.id}
                  onPress={() => toggleRuntimeTask(task.id)}
                  style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: task.completed ? "#5aa36f" : "#353535",
                    backgroundColor: task.completed ? "#17221a" : "#171717",
                    padding: 9,
                    gap: 4,
                  }}
                >
                  <Text style={{ color: "#f5f5f5", fontSize: 13, fontWeight: "700" }}>{task.title}</Text>
                  <Text style={{ color: "rgba(245,245,245,0.64)", fontSize: 11 }}>{task.owner} · {task.due} · {formatTime(task.createdAt)}</Text>
                  <Text style={{ color: task.completed ? "#c7f0d3" : "#e3d4ab", fontSize: 11 }}>{task.completed ? "완료됨(다시 누르면 미완료)" : "대기중(눌러서 완료 처리)"}</Text>
                </Pressable>
              ))
            ) : (
              <Text style={{ color: "rgba(245,245,245,0.56)", fontSize: 12 }}>아직 실행 로그가 없어. 월드에서 모라 명령을 한 번 실행해봐.</Text>
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
