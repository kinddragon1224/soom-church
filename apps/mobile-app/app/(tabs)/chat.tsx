import { useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";

import { sendChatCommand } from "../../lib/chat-source";
import { mabiTheme } from "../../lib/ui-theme";
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
      style={{ borderRadius: 10, borderWidth: 2, borderColor: "rgba(138,160,199,0.5)", backgroundColor: mabiTheme.pixelPanelSoft, paddingVertical: 10, paddingHorizontal: 10 }}
    >
      <Text style={{ color: mabiTheme.pixelInk, fontSize: 13 }}>{label}</Text>
    </Pressable>
  );
}

export default function ChatScreen() {
  const { loading, snapshot, chatDraft, setChatDraft, addRuntimeTask } = useWorldStore();
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastActionIds, setLastActionIds] = useState<string[]>([]);

  const submitDraft = async () => {
    const text = chatDraft.trim();
    if (!text || sending) return;

    setSending(true);
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text }]);
    setChatDraft("");

    const result = await sendChatCommand(text);

    setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", text: result.reply }]);
    setLastActionIds(result.actions.map((item) => item.id));

    result.actions.forEach((action, index) => {
      addRuntimeTask({
        id: `${action.id}-${Date.now()}-${index}`,
        title: action.title,
        due: action.due,
        owner: action.owner,
      });
    });

    setSending(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: mabiTheme.background }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120, gap: 14 }}>
        <Text style={{ color: mabiTheme.textMuted, fontSize: 11, letterSpacing: 2 }}>SOOM CHAT</Text>
        <Text style={{ color: mabiTheme.textPrimary, fontSize: 29, fontWeight: "700", lineHeight: 34 }}>포켓 대화 명령</Text>

        <View style={{ borderRadius: 12, borderWidth: 2, borderColor: mabiTheme.pixelBorder, backgroundColor: mabiTheme.pixelPanel, padding: 12, gap: 10 }}>
          <Text style={{ color: mabiTheme.pixelAccent, fontSize: 12, fontWeight: "700" }}>추천 명령</Text>
          {loading || !snapshot ? (
            <Text style={{ color: "rgba(255,255,255,0.7)" }}>추천 명령 로딩 중...</Text>
          ) : (
            snapshot.chatQuickActions.map((item) => <QuickAction key={item} label={item} onPress={() => setChatDraft(item)} />)
          )}
        </View>

        <View style={{ borderRadius: 12, borderWidth: 2, borderColor: mabiTheme.pixelBorder, backgroundColor: "#223149", padding: 12, gap: 10 }}>
          <Text style={{ color: "rgba(245,242,232,0.62)", fontSize: 12 }}>입력창</Text>

          <TextInput
            value={chatDraft}
            onChangeText={setChatDraft}
            placeholder="예: 오늘 후속 3개만 뽑아줘"
            placeholderTextColor="rgba(245,242,232,0.4)"
            multiline
            style={{
              minHeight: 82,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: "rgba(138,160,199,0.45)",
              backgroundColor: "rgba(10,18,30,0.32)",
              color: mabiTheme.pixelInk,
              paddingHorizontal: 10,
              paddingVertical: 8,
              textAlignVertical: "top",
            }}
          />

          <Pressable
            onPress={submitDraft}
            disabled={sending || !chatDraft.trim()}
            style={{
              minHeight: 44,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: "rgba(243,208,128,0.55)",
              backgroundColor: "rgba(243,208,128,0.2)",
              alignItems: "center",
              justifyContent: "center",
              opacity: sending || !chatDraft.trim() ? 0.55 : 1,
              flexDirection: "row",
              gap: 8,
            }}
          >
            {sending ? <ActivityIndicator color="#f5f2e8" size="small" /> : null}
            <Text style={{ color: mabiTheme.pixelInk, fontSize: 13, fontWeight: "700" }}>{sending ? "전송 중..." : "명령 보내기"}</Text>
          </Pressable>
        </View>

        {lastActionIds.length ? (
          <View style={{ borderRadius: 10, borderWidth: 2, borderColor: "rgba(143,224,170,0.55)", backgroundColor: "rgba(143,224,170,0.13)", padding: 10 }}>
            <Text style={{ color: mabiTheme.pixelSuccess, fontSize: 12, fontWeight: "700" }}>이번 응답 실행 항목이 할 일 탭에 자동 추가됨</Text>
          </View>
        ) : null}

        {messages.length ? (
          <View style={{ borderRadius: 12, borderWidth: 2, borderColor: mabiTheme.pixelBorder, backgroundColor: "rgba(42,54,80,0.88)", padding: 10, gap: 8 }}>
            {messages.map((message) => (
              <View
                key={message.id}
                style={{
                  alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "92%",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: message.role === "user" ? "rgba(243,208,128,0.55)" : "rgba(138,160,199,0.45)",
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  backgroundColor: message.role === "user" ? "rgba(243,208,128,0.18)" : "rgba(255,255,255,0.06)",
                }}
              >
                <Text style={{ color: mabiTheme.pixelInk, fontSize: 13, lineHeight: 19 }}>{message.text}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
