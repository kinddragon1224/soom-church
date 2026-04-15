import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import { useWorldStore } from "../../lib/world-store";

const TARGET_DAYS = 7;

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 96, gap: 10 }}>
        <Text style={{ color: "rgba(230,230,230,0.56)", fontSize: 11, letterSpacing: 1.5 }}>ATTENDANCE</Text>
        <Text style={{ color: "#f5f5f5", fontSize: 28, fontWeight: "700", marginTop: 4 }}>출석</Text>

        <View style={{ borderRadius: 14, borderWidth: 1, borderColor: "rgba(143,224,170,0.45)", backgroundColor: "rgba(12,35,24,0.45)", padding: 12 }}>
          <Text style={{ color: "#d7ffe3", fontSize: 12, fontWeight: "700" }}>7일 보상 진행도</Text>
          <Text style={{ color: "#f5f5f5", fontSize: 20, fontWeight: "800", marginTop: 4 }}>{streakDays} / {rewardTarget}일</Text>
          <View style={{ marginTop: 8, height: 10, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.14)", overflow: "hidden" }}>
            <View style={{ width: `${progress * 100}%`, height: "100%", backgroundColor: "#8fe0aa" }} />
          </View>
          <Text style={{ color: "rgba(216,255,229,0.76)", fontSize: 11, marginTop: 6 }}>
            {remainDays > 0 ? `마리아 보상까지 ${remainDays}일 남음` : "마리아 보상 달성 완료"}
          </Text>
        </View>

        <View style={{ borderRadius: 12, borderWidth: 1, borderColor: "#2a2a2a", backgroundColor: "#141414", padding: 10, flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "#5aa36f", backgroundColor: "#152419", padding: 8 }}>
            <Text style={{ color: "#c7f0d3", fontSize: 10 }}>연속 출석</Text>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 2 }}>{streakDays}일</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "#4e6590", backgroundColor: "#18202e", padding: 8 }}>
            <Text style={{ color: "#d8e7ff", fontSize: 10 }}>총 접속</Text>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 2 }}>{totalDays}일</Text>
          </View>
        </View>

        <View style={{ borderRadius: 12, borderWidth: 1, borderColor: "#2f2f2f", backgroundColor: "#131313", padding: 10, gap: 6 }}>
          <Text style={{ color: "#d8d8d8", fontSize: 12, fontWeight: "700" }}>출석 상태</Text>
          <Text style={{ color: "rgba(245,245,245,0.72)", fontSize: 11 }}>최근 출석 날짜: {lastDate}</Text>
          <Text style={{ color: "rgba(245,245,245,0.72)", fontSize: 11 }}>
            연속 여부: {isConsecutive ? "유지 중" : "재시작/미유지"}
          </Text>
        </View>

        <View style={{ borderRadius: 12, borderWidth: 1, borderColor: "rgba(120,157,214,0.42)", backgroundColor: "rgba(24,32,46,0.5)", padding: 10 }}>
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
                    borderColor: filled ? "#8fe0aa" : "#3a3a3a",
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
            backgroundColor: "rgba(24,32,46,0.72)",
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
