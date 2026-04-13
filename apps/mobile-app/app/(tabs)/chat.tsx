import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import { useWorldStore } from "../../lib/world-store";

function QuickAction({ label }: { label: string }) {
  return (
    <Pressable style={{ borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.04)", paddingVertical: 12, paddingHorizontal: 12 }}>
      <Text style={{ color: "#fff", fontSize: 13 }}>{label}</Text>
    </Pressable>
  );
}

export default function ChatScreen() {
  const { loading, snapshot, chatDraft, setChatDraft } = useWorldStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#07111f" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120, gap: 14 }}>
        <Text style={{ color: "rgba(255,255,255,0.46)", fontSize: 11, letterSpacing: 2 }}>SOOM CHAT</Text>
        <Text style={{ color: "#fff", fontSize: 29, fontWeight: "700", lineHeight: 34 }}>채팅으로 운영하기</Text>

        <View style={{ borderRadius: 22, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.05)", padding: 16, gap: 10 }}>
          <Text style={{ color: "rgba(255,255,255,0.62)", fontSize: 13 }}>추천 명령</Text>
          {loading || !snapshot ? (
            <Text style={{ color: "rgba(255,255,255,0.7)" }}>추천 명령 로딩 중...</Text>
          ) : (
            snapshot.chatQuickActions.map((item) => <QuickAction key={item} label={item} />)
          )}
        </View>

        <View style={{ borderRadius: 22, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", backgroundColor: "#0f1b2e", padding: 16, gap: 10 }}>
          <Text style={{ color: "rgba(255,255,255,0.62)", fontSize: 12 }}>입력창(예정)</Text>
          {chatDraft ? (
            <View style={{ borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", backgroundColor: "rgba(255,255,255,0.04)", padding: 10 }}>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>월드에서 가져온 초안</Text>
              <Text style={{ color: "#fff", marginTop: 6 }}>{chatDraft}</Text>
            </View>
          ) : null}

          <Pressable
            onPress={() => setChatDraft("오늘 해야 할 후속 3개만 뽑아줘")}
            style={{ minHeight: 44, borderRadius: 999, borderWidth: 1, borderColor: "rgba(255,255,255,0.14)", backgroundColor: "rgba(255,255,255,0.03)", alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>{chatDraft ? "초안 바꾸기" : "초안 만들기"}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
