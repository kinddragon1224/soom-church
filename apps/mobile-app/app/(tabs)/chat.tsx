import { useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";

import { sendChatCommand } from "../../lib/chat-source";
import { useWorldStore } from "../../lib/world-store";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

function QuickAction({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{ borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.04)", paddingVertical: 12, paddingHorizontal: 12 }}
    >
      <Text style={{ color: "#fff", fontSize: 13 }}>{label}</Text>
    </Pressable>
  );
}

export default function ChatScreen() {
  const { loading, snapshot, chatDraft, setChatDraft } = useWorldStore();
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const submitDraft = async () => {
    const text = chatDraft.trim();
    if (!text || sending) return;

    setSending(true);
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text }]);
    setChatDraft("");

    const reply = await sendChatCommand(text);

    setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", text: reply }]);
    setSending(false);
  };

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
            snapshot.chatQuickActions.map((item) => <QuickAction key={item} label={item} onPress={() => setChatDraft(item)} />)
          )}
        </View>

        <View style={{ borderRadius: 22, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", backgroundColor: "#0f1b2e", padding: 16, gap: 10 }}>
          <Text style={{ color: "rgba(255,255,255,0.62)", fontSize: 12 }}>입력창</Text>

          <TextInput
            value={chatDraft}
            onChangeText={setChatDraft}
            placeholder="예: 오늘 후속 3개만 뽑아줘"
            placeholderTextColor="rgba(255,255,255,0.4)"
            multiline
            style={{
              minHeight: 86,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.12)",
              backgroundColor: "rgba(255,255,255,0.04)",
              color: "#fff",
              paddingHorizontal: 12,
              paddingVertical: 10,
              textAlignVertical: "top",
            }}
          />

          <Pressable
            onPress={submitDraft}
            disabled={sending || !chatDraft.trim()}
            style={{
              minHeight: 44,
              borderRadius: 999,
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
              opacity: sending || !chatDraft.trim() ? 0.55 : 1,
              flexDirection: "row",
              gap: 8,
            }}
          >
            {sending ? <ActivityIndicator color="#07111f" size="small" /> : null}
            <Text style={{ color: "#07111f", fontSize: 13, fontWeight: "700" }}>{sending ? "전송 중..." : "명령 보내기"}</Text>
          </Pressable>
        </View>

        {messages.length ? (
          <View style={{ borderRadius: 22, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.03)", padding: 12, gap: 8 }}>
            {messages.map((message) => (
              <View
                key={message.id}
                style={{
                  alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "92%",
                  borderRadius: 14,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  backgroundColor: message.role === "user" ? "#ffffff" : "rgba(255,255,255,0.09)",
                }}
              >
                <Text style={{ color: message.role === "user" ? "#07111f" : "#fff", fontSize: 13, lineHeight: 19 }}>{message.text}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
