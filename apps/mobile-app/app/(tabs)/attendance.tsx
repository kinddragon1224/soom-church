import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import { useWorldStore } from "../../lib/world-store";

const TARGET_DAYS = 7;
const MILESTONES = [
  { day: 1, title: "소형 오브젝트 I" },
  { day: 3, title: "소형 오브젝트 II" },
  { day: 5, title: "소형 오브젝트 III" },
  { day: 7, title: "마리아 NPC" },
] as const;

export default function AttendanceScreen() {
  const { attendanceReward, refreshAttendance } = useWorldStore();

  const totalDays = attendanceReward?.totalAttendanceDays ?? 0;
  const streakDays = attendanceReward?.streakCount ?? 0;
  const isConsecutive = attendanceReward?.lastCheckWasConsecutive ?? false;
  const rewardTarget = attendanceReward?.rewardTargetDays ?? TARGET_DAYS;
  const remainDays = Math.max(0, rewardTarget - streakDays);
  const progress = Math.max(0, Math.min(1, streakDays / rewardTarget));
  const lastDate = attendanceReward?.lastAttendanceDate ?? "기록 없음";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0b0d14" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 96, gap: 10 }}>
        <Text style={{ color: "rgba(230,230,230,0.56)", fontSize: 11, letterSpacing: 1.5 }}>MOKJANG ATTENDANCE</Text>
        <Text style={{ color: "#f5f5f5", fontSize: 28, fontWeight: "700", marginTop: 4 }}>출석 보상</Text>

        <View style={{ borderRadius: 14, borderWidth: 1, borderColor: "rgba(120,157,214,0.5)", backgroundColor: "#121a2b", padding: 12 }}>
          <Text style={{ color: "#d8e7ff", fontSize: 12, fontWeight: "700" }}>7일 보상 진행도</Text>
          <Text style={{ color: "#ffffff", fontSize: 22, fontWeight: "800", marginTop: 4 }}>{streakDays} / {rewardTarget}일</Text>
          <View style={{ marginTop: 8, height: 10, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.14)", overflow: "hidden" }}>
            <View style={{ width: `${progress * 100}%`, height: "100%", backgroundColor: "#8fe0aa" }} />
          </View>
          <Text style={{ color: "rgba(216,231,255,0.84)", fontSize: 11, marginTop: 6 }}>
            {remainDays > 0 ? `마리아 보상까지 ${remainDays}일 남음` : "마리아 보상 달성 완료"}
          </Text>
        </View>

        <View style={{ borderRadius: 12, borderWidth: 1, borderColor: "#2b2f3a", backgroundColor: "#11141d", padding: 10, flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "#5aa36f", backgroundColor: "#152419", padding: 8 }}>
            <Text style={{ color: "#c7f0d3", fontSize: 10 }}>연속 출석</Text>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 2 }}>{streakDays}일</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "#4e6590", backgroundColor: "#18202e", padding: 8 }}>
            <Text style={{ color: "#d8e7ff", fontSize: 10 }}>총 접속</Text>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 2 }}>{totalDays}일</Text>
          </View>
        </View>

        <View style={{ borderRadius: 12, borderWidth: 1, borderColor: "#2b2f3a", backgroundColor: "#11141d", padding: 10, gap: 6 }}>
          <Text style={{ color: "#d8d8d8", fontSize: 12, fontWeight: "700" }}>출석 상태</Text>
          <Text style={{ color: "rgba(245,245,245,0.76)", fontSize: 11 }}>최근 출석 날짜: {lastDate}</Text>
          <Text style={{ color: "rgba(245,245,245,0.76)", fontSize: 11 }}>연속 여부: {isConsecutive ? "유지 중" : "재시작/미유지"}</Text>
        </View>

        <View style={{ borderRadius: 12, borderWidth: 1, borderColor: "rgba(120,157,214,0.46)", backgroundColor: "#121a2b", padding: 10 }}>
          <Text style={{ color: "#d8e7ff", fontSize: 12, fontWeight: "700" }}>보상 타임라인 (1~7일)</Text>
          <View style={{ marginTop: 8, gap: 6 }}>
            {MILESTONES.map((item) => {
              const unlocked = streakDays >= item.day;
              return (
                <View
                  key={`milestone-${item.day}`}
                  style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: unlocked ? "#8fe0aa" : "#3b4254",
                    backgroundColor: unlocked ? "rgba(143,224,170,0.18)" : "rgba(255,255,255,0.03)",
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: unlocked ? "#d7ffe3" : "#d8e7ff", fontSize: 11, fontWeight: "700" }}>{item.day}일차 · {item.title}</Text>
                  <Text style={{ color: unlocked ? "#b7ffd0" : "rgba(216,231,255,0.58)", fontSize: 10, fontWeight: "700" }}>{unlocked ? "획득" : "대기"}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ borderRadius: 12, borderWidth: 1, borderColor: "rgba(120,157,214,0.42)", backgroundColor: "#121a2b", padding: 10 }}>
          <Text style={{ color: "#d8e7ff", fontSize: 12, fontWeight: "700" }}>최근 7일 뷰</Text>
          <View style={{ marginTop: 8, flexDirection: "row", gap: 6 }}>
            {Array.from({ length: 7 }).map((_, index) => {
              const filled = index < Math.min(streakDays, 7);
              return (
                <View
                  key={`att-${index}`}
                  style={{
                    flex: 1,
                    minHeight: 28,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: filled ? "#8fe0aa" : "#3a3f4f",
                    backgroundColor: filled ? "rgba(143,224,170,0.2)" : "rgba(255,255,255,0.04)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: filled ? "#d7ffe3" : "rgba(245,245,245,0.45)", fontSize: 10, fontWeight: "700" }}>{index + 1}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <Pressable
          onPress={refreshAttendance}
          style={{
            marginTop: 6,
            minHeight: 44,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "rgba(120,157,214,0.55)",
            backgroundColor: "rgba(24,32,46,0.82)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#d8e7ff", fontWeight: "700" }}>출석 상태 갱신</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
