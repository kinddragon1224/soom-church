import { SafeAreaView, Text, View, Pressable } from "react-native";

const cardStyle = {
  borderRadius: 22,
  padding: 18,
  backgroundColor: "rgba(255,255,255,0.06)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
} as const;

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#07111f" }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 28, gap: 16 }}>
        <View style={{ gap: 8 }}>
          <Text style={{ color: "rgba(255,255,255,0.46)", fontSize: 11, letterSpacing: 2 }}>SOOM MOBILE</Text>
          <Text style={{ color: "#ffffff", fontSize: 34, fontWeight: "700", lineHeight: 38 }}>목장 월드로{"\n"}들어가기</Text>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 24 }}>
            세로형 월드, 채팅형 운영, 사람과 돌봄 흐름을 한 앱 안에서 다룬다.
          </Text>
        </View>

        <View style={[cardStyle, { minHeight: 320, backgroundColor: "#13253c" }]}>
          <Text style={{ color: "rgba(255,255,255,0.58)", fontSize: 12 }}>WORLD PREVIEW</Text>
          <View style={{ flex: 1, marginTop: 14, borderRadius: 24, backgroundColor: "#20314d", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "600" }}>월드 / 채팅 / 사람 / 할 일</Text>
            <Text style={{ color: "rgba(255,255,255,0.62)", fontSize: 13, marginTop: 10 }}>첫 Expo 뼈대 화면</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable style={{ flex: 1, minHeight: 52, borderRadius: 999, backgroundColor: "#ffffff", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#07111f", fontWeight: "700" }}>월드</Text>
          </Pressable>
          <Pressable style={{ flex: 1, minHeight: 52, borderRadius: 999, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.04)", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#ffffff", fontWeight: "600" }}>채팅</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
