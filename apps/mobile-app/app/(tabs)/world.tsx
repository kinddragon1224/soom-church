import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

const card = {
  borderRadius: 24,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.05)",
  padding: 16,
} as const;

export default function WorldScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#07111f" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120, gap: 16 }}>
        <View style={{ gap: 8 }}>
          <Text style={{ color: "rgba(255,255,255,0.46)", fontSize: 11, letterSpacing: 2 }}>SOOM WORLD</Text>
          <Text style={{ color: "#fff", fontSize: 32, fontWeight: "700", lineHeight: 37 }}>목장 상태를
            한눈에</Text>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 24 }}>
            월드는 조작 화면이 아니라 상태를 읽는 화면이다. 돌봄, 기도, 후속 흐름을 오브젝트로 보여준다.
          </Text>
        </View>

        <View style={[card, { minHeight: 320, backgroundColor: "#13253c" }]}>
          <Text style={{ color: "rgba(255,255,255,0.58)", fontSize: 12 }}>MOKJANG MAP</Text>
          <View style={{ flex: 1, marginTop: 14, borderRadius: 22, backgroundColor: "#20314d", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>세로 스크롤 월드 영역</Text>
            <Text style={{ color: "rgba(255,255,255,0.62)", fontSize: 12, marginTop: 8 }}>집 / 사람 / 상태 이펙트 배치 예정</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable style={{ flex: 1, minHeight: 52, borderRadius: 999, backgroundColor: "#ffffff", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#07111f", fontWeight: "700" }}>월드 열기</Text>
          </Pressable>
          <Pressable style={{ flex: 1, minHeight: 52, borderRadius: 999, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.04)", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#ffffff", fontWeight: "600" }}>채팅 실행</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
