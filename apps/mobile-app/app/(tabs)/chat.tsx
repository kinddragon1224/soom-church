import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import { chatQuickActions } from "../../lib/world-model";

function QuickAction({ label }: { label: string }) {
  return (
    <Pressable style={{ borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.04)", paddingVertical: 12, paddingHorizontal: 12 }}>
      <Text style={{ color: "#fff", fontSize: 13 }}>{label}</Text>
    </Pressable>
  );
}

export default function ChatScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#07111f" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120, gap: 14 }}>
        <Text style={{ color: "rgba(255,255,255,0.46)", fontSize: 11, letterSpacing: 2 }}>SOOM CHAT</Text>
        <Text style={{ color: "#fff", fontSize: 29, fontWeight: "700", lineHeight: 34 }}>채팅으로 운영하기</Text>

        <View style={{ borderRadius: 22, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.05)", padding: 16, gap: 10 }}>
          <Text style={{ color: "rgba(255,255,255,0.62)", fontSize: 13 }}>추천 명령</Text>
          {chatQuickActions.map((item) => (
            <QuickAction key={item} label={item} />
          ))}
        </View>

        <View style={{ borderRadius: 22, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", backgroundColor: "#0f1b2e", padding: 16 }}>
          <Text style={{ color: "rgba(255,255,255,0.62)", fontSize: 12 }}>입력창(예정)</Text>
          <Text style={{ color: "#fff", marginTop: 8 }}>텍스트 입력 + 빠른액션 버튼 + 최근 명령 재사용</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
