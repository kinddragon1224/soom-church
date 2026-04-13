import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

import PixelSprite from "../../components/pixel-sprite";
import { sendChatCommand } from "../../lib/chat-source";
import { type WorldObject } from "../../lib/world-model";
import { mabiTheme } from "../../lib/ui-theme";
import { useWorldStore } from "../../lib/world-store";

type WorldChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

function tone(kind: WorldObject["kind"], active: boolean) {
  if (kind === "hub") {
    return { bg: active ? "#c99a4d" : "#9f7740", border: "#f3ddb0", text: "#fff8ea" };
  }

  if (kind === "house") {
    return { bg: active ? "#4c5f63" : "#3b4a4f", border: active ? "#d9e7df" : "#9db1a7", text: "#f8f5ed" };
  }

  return { bg: active ? "#4e86a8" : "#3e6e8c", border: active ? "#d3e6f3" : "#9fbfd5", text: "#f8f5ed" };
}

function stateFrame(state: string, isSelected: boolean): "normal" | "selected" | "alert" | "done" {
  if (isSelected) return "selected";
  if (state.includes("돌봄") || state.includes("후속") || state.includes("연락")) return "alert";
  if (state.includes("안정") || state.includes("완료")) return "done";
  return "normal";
}

function stateBadge(state: string) {
  if (state.includes("돌봄") || state.includes("후속") || state.includes("연락")) {
    return { label: "관리 필요", bg: "rgba(242,168,168,0.2)", border: "rgba(242,168,168,0.5)", text: "#ffd7d7" };
  }

  if (state.includes("안정") || state.includes("완료")) {
    return { label: "안정", bg: "rgba(143,224,170,0.2)", border: "rgba(143,224,170,0.5)", text: "#d7ffe3" };
  }

  return { label: "진행중", bg: "rgba(243,208,128,0.2)", border: "rgba(243,208,128,0.5)", text: "#ffeabf" };
}

export default function WorldScreen() {
  const { loading, snapshot, selectedId, setSelectedId, setChatDraft, addRuntimeTask } = useWorldStore();
  const [worldDraft, setWorldDraft] = useState("");
  const [worldSending, setWorldSending] = useState(false);
  const [worldMessages, setWorldMessages] = useState<WorldChatMessage[]>([]);

  if (loading || !snapshot) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: mabiTheme.background, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: mabiTheme.textPrimary }}>월드 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  const summary = {
    objectCount: snapshot.worldObjects.length,
    householdCount: snapshot.worldObjects.filter((item) => item.kind === "house").length,
    peopleCount: snapshot.peopleRecords.length,
  };

  const selected = useMemo(() => {
    return snapshot.worldObjects.find((item) => item.id === selectedId) ?? snapshot.worldObjects[0];
  }, [selectedId, snapshot.worldObjects]);

  const selectedBadge = stateBadge(selected.state);

  const submitWorldChat = async () => {
    const text = worldDraft.trim();
    if (!text || worldSending) return;

    setWorldSending(true);
    setWorldMessages((prev) => [...prev, { id: `wu-${Date.now()}`, role: "user", text }]);
    setWorldDraft("");

    const result = await sendChatCommand(text);

    setWorldMessages((prev) => [...prev, { id: `wa-${Date.now()}`, role: "assistant", text: result.reply }]);

    const growthSummary = result.agentGrowth?.summary;
    if (growthSummary) {
      setWorldMessages((prev) => [...prev, { id: `wg-${Date.now()}`, role: "assistant", text: `에이전트 루프: ${growthSummary}` }]);
    }

    result.actions.forEach((action, index) => {
      addRuntimeTask({
        id: `${action.id}-world-${Date.now()}-${index}`,
        title: action.title,
        due: action.due,
        owner: action.owner,
      });
    });

    setWorldSending(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: mabiTheme.background }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ color: mabiTheme.textMuted, fontSize: 11, letterSpacing: 2 }}>SOOM WORLD</Text>
        <Text style={{ color: mabiTheme.textPrimary, fontSize: 31, fontWeight: "700", lineHeight: 36, marginTop: 6 }}>목장 월드</Text>
        <Text style={{ color: mabiTheme.textMuted, fontSize: 14, lineHeight: 22, marginTop: 6 }}>마을을 내려보며 오늘 해야 할 돌봄을 고른다.</Text>

        <View style={{ marginTop: 10, alignSelf: "flex-start", borderRadius: 999, borderWidth: 1, borderColor: "rgba(214,178,112,0.55)", backgroundColor: "rgba(214,178,112,0.16)", paddingHorizontal: 12, paddingVertical: 5 }}>
          <Text style={{ color: "#f4e2bf", fontSize: 12 }}>오브젝트 {summary.objectCount} · 가정 {summary.householdCount} · 사람 {summary.peopleCount}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}>
        <View
          style={{
            height: 620,
            borderRadius: 28,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
            overflow: "hidden",
            backgroundColor: mabiTheme.mapPanel,
          }}
        >
          <View style={{ position: "absolute", inset: 0, backgroundColor: mabiTheme.mist }} />
          <View style={{ position: "absolute", left: 18, top: 110, width: 140, height: 4, borderRadius: 999, backgroundColor: "rgba(220,198,159,0.55)", transform: [{ rotate: "11deg" }] }} />
          <View style={{ position: "absolute", right: 30, top: 250, width: 128, height: 4, borderRadius: 999, backgroundColor: "rgba(220,198,159,0.55)", transform: [{ rotate: "-16deg" }] }} />
          <View style={{ position: "absolute", left: 120, bottom: 130, width: 120, height: 4, borderRadius: 999, backgroundColor: "rgba(220,198,159,0.55)" }} />

          {snapshot.worldObjects.map((item) => {
            const isActive = selectedId === item.id;
            const colors = tone(item.kind, isActive);
            const frame = stateFrame(item.state, isActive);

            return (
              <Pressable
                key={item.id}
                onPress={() => setSelectedId(item.id)}
                style={{
                  position: "absolute",
                  left: item.x,
                  top: item.y,
                  minWidth: item.kind === "person" ? 82 : 102,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: colors.border,
                  backgroundColor: colors.bg,
                  paddingVertical: 8,
                  paddingHorizontal: 8,
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOpacity: isActive ? 0.32 : 0.12,
                  shadowRadius: isActive ? 10 : 4,
                  shadowOffset: { width: 0, height: 3 },
                  elevation: isActive ? 5 : 1,
                }}
              >
                <PixelSprite kind={item.kind} pixel={3} frame={frame} showBadge={frame !== "normal"} />
                <Text style={{ color: colors.text, fontSize: 11, fontWeight: "700", marginTop: 5 }}>{item.name}</Text>
                <Text style={{ color: "rgba(255,255,255,0.82)", fontSize: 10, marginTop: 1 }}>{item.state}</Text>
              </Pressable>
            );
          })}
        </View>

        <View
          style={{
            marginTop: 12,
            borderRadius: 22,
            borderWidth: 1,
            borderColor: "rgba(193,167,120,0.4)",
            backgroundColor: mabiTheme.parchment,
            padding: 14,
          }}
        >
          <Text style={{ color: "#7d6341", fontSize: 12 }}>선택된 오브젝트</Text>
          <Text style={{ color: "#2c2217", fontSize: 20, fontWeight: "700", marginTop: 6 }}>{selected.name}</Text>
          <View style={{ marginTop: 7, alignSelf: "flex-start", borderRadius: 8, borderWidth: 1, borderColor: selectedBadge.border, backgroundColor: selectedBadge.bg, paddingHorizontal: 8, paddingVertical: 4 }}>
            <Text style={{ color: selectedBadge.text, fontSize: 11, fontWeight: "700" }}>{selectedBadge.label}</Text>
          </View>
          <Text style={{ color: "#59462f", marginTop: 8, lineHeight: 20 }}>{selected.note}</Text>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
            <Pressable
              onPress={() => {
                setChatDraft(`${selected.name} 상태 기준으로 오늘 바로 할 1가지 행동만 추천해줘`);
                router.push("/(tabs)/tasks");
              }}
              style={{ flex: 1, minHeight: 48, borderRadius: 999, backgroundColor: "#3f4f58", alignItems: "center", justifyContent: "center" }}
            >
              <Text style={{ color: "#f7f1e4", fontWeight: "700" }}>바로 실행</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setChatDraft(`${selected.name} 관련 후속 진행 상황 요약해줘`);
                router.push("/(tabs)/chat");
              }}
              style={{ flex: 1, minHeight: 48, borderRadius: 999, borderWidth: 1, borderColor: "rgba(63,79,88,0.35)", backgroundColor: mabiTheme.parchmentSoft, alignItems: "center", justifyContent: "center" }}
            >
              <Text style={{ color: "#39454d", fontWeight: "700" }}>채팅 탭으로 열기</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ marginTop: 12, borderRadius: 12, borderWidth: 2, borderColor: mabiTheme.pixelBorder, backgroundColor: "#223149", padding: 12, gap: 10 }}>
          <Text style={{ color: mabiTheme.pixelAccent, fontSize: 12, fontWeight: "700" }}>월드 내 채팅</Text>

          <TextInput
            value={worldDraft}
            onChangeText={setWorldDraft}
            placeholder="월드에서 바로 물어보기"
            placeholderTextColor="rgba(245,242,232,0.4)"
            multiline
            style={{
              minHeight: 76,
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
            onPress={submitWorldChat}
            disabled={worldSending || !worldDraft.trim()}
            style={{
              minHeight: 42,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: "rgba(243,208,128,0.55)",
              backgroundColor: "rgba(243,208,128,0.2)",
              alignItems: "center",
              justifyContent: "center",
              opacity: worldSending || !worldDraft.trim() ? 0.55 : 1,
              flexDirection: "row",
              gap: 8,
            }}
          >
            {worldSending ? <ActivityIndicator color="#f5f2e8" size="small" /> : null}
            <Text style={{ color: mabiTheme.pixelInk, fontSize: 13, fontWeight: "700" }}>{worldSending ? "전송 중..." : "월드에서 실행"}</Text>
          </Pressable>

          {worldMessages.length ? (
            <View style={{ borderRadius: 10, borderWidth: 1, borderColor: "rgba(138,160,199,0.4)", backgroundColor: "rgba(42,54,80,0.7)", padding: 8, gap: 7 }}>
              {worldMessages.slice(-4).map((message) => (
                <View
                  key={message.id}
                  style={{
                    alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "92%",
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: message.role === "user" ? "rgba(243,208,128,0.55)" : "rgba(138,160,199,0.45)",
                    backgroundColor: message.role === "user" ? "rgba(243,208,128,0.18)" : "rgba(255,255,255,0.06)",
                    paddingHorizontal: 9,
                    paddingVertical: 7,
                  }}
                >
                  <Text style={{ color: mabiTheme.pixelInk, fontSize: 12, lineHeight: 17 }}>{message.text}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
