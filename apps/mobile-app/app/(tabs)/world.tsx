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

export default function WorldScreen() {
  const { loading, snapshot, selectedId, setSelectedId, addRuntimeTask } = useWorldStore();
  const [worldDraft, setWorldDraft] = useState("");
  const [worldSending, setWorldSending] = useState(false);
  const [worldMessages, setWorldMessages] = useState<WorldChatMessage[]>([]);

  const selected = useMemo(() => {
    if (!snapshot?.worldObjects?.length) return null;
    return snapshot.worldObjects.find((item) => item.id === selectedId) ?? snapshot.worldObjects[0];
  }, [selectedId, snapshot]);

  if (loading || !snapshot || !selected) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: mabiTheme.background, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: mabiTheme.textPrimary }}>목양 월드 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  const urgentCount = snapshot.peopleRecords.filter((p) => p.state.includes("후속") || p.state.includes("돌봄")).length;
  const prayerCount = snapshot.peopleRecords.filter((p) => p.state.includes("기도")).length;
  const operationIndex = 120 + snapshot.peopleRecords.length * 3 + urgentCount * 2;

  const submitWorldChat = async () => {
    const text = worldDraft.trim();
    if (!text || worldSending) return;

    setWorldSending(true);
    setWorldMessages((prev) => [...prev, { id: `wu-${Date.now()}`, role: "user", text }]);
    setWorldDraft("");

    const result = await sendChatCommand(text);

    setWorldMessages((prev) => [...prev, { id: `wa-${Date.now()}`, role: "assistant", text: result.reply }]);

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
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 84 }}>
        <View style={{ borderRadius: 14, borderWidth: 1, borderColor: "rgba(120,157,214,0.35)", backgroundColor: "rgba(20,29,45,0.92)", padding: 11, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={{ color: "#8ea6d2", fontSize: 10 }}>목양 월드 · 메인</Text>
            <Text style={{ color: "#f4f7ff", fontSize: 14, fontWeight: "700" }}>운영지수 {operationIndex}</Text>
          </View>
          <Text style={{ color: "#ffd687", fontSize: 11 }}>긴급 {urgentCount} · 기도 {prayerCount}</Text>
        </View>

        <View style={{
          marginTop: 10,
          height: 560,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.08)",
          overflow: "hidden",
          backgroundColor: mabiTheme.mapPanel,
        }}>
          <View style={{ position: "absolute", inset: 0, backgroundColor: mabiTheme.mist }} />
          <View style={{ position: "absolute", left: 10, right: 10, top: 10, borderRadius: 10, borderWidth: 1, borderColor: "rgba(143,224,170,0.38)", backgroundColor: "rgba(13,31,24,0.68)", paddingHorizontal: 10, paddingVertical: 6, flexDirection: "row", justifyContent: "space-between", zIndex: 10 }}>
            <Text style={{ color: "#d7ffe3", fontSize: 11, fontWeight: "700" }}>목양 실행창 · 자동 운영 ON</Text>
            <Text style={{ color: "#f4d38e", fontSize: 11 }}>모라 처리중</Text>
          </View>

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
                }}
              >
                <PixelSprite kind={item.kind} frame={frame} showBadge={frame !== "normal"} />
                <Text style={{ color: colors.text, fontSize: 11, fontWeight: "700", marginTop: 5 }}>{item.name}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ marginTop: 10, borderRadius: 14, borderWidth: 1, borderColor: "rgba(120,157,214,0.35)", backgroundColor: "rgba(20,29,45,0.92)", padding: 10 }}>
          <Text style={{ color: "#a9c3ef", fontSize: 11, fontWeight: "700", marginBottom: 8 }}>모라에게 명령</Text>

          <View style={{ flexDirection: "row", gap: 6, marginBottom: 7 }}>
            {[
              "모라, 후속 3명 오늘 배정",
              "모라, 기도 요청 우선 정리",
              "모라, 오늘 목양 요약",
            ].map((cmd) => (
              <Pressable key={cmd} onPress={() => setWorldDraft(cmd)} style={{ borderRadius: 999, borderWidth: 1, borderColor: "rgba(120,157,214,0.45)", backgroundColor: "rgba(52,86,156,0.38)", paddingHorizontal: 8, paddingVertical: 4 }}>
                <Text style={{ color: "#dbe8ff", fontSize: 10 }}>{cmd.replace("모라, ", "")}</Text>
              </Pressable>
            ))}
          </View>

          <View style={{ borderRadius: 12, borderWidth: 1, borderColor: "rgba(120,157,214,0.25)", backgroundColor: "rgba(11,18,29,0.7)", padding: 8, gap: 6, minHeight: 64 }}>
            {worldMessages.length ? (
              worldMessages.slice(-3).map((message) => (
                <View key={message.id} style={{ alignSelf: message.role === "user" ? "flex-end" : "flex-start", maxWidth: "92%", borderRadius: 14, borderWidth: 1, borderColor: message.role === "user" ? "rgba(86,129,214,0.7)" : "rgba(255,255,255,0.14)", backgroundColor: message.role === "user" ? "rgba(52,86,156,0.72)" : "rgba(255,255,255,0.07)", paddingHorizontal: 10, paddingVertical: 7 }}>
                  <Text style={{ color: "#f4f7ff", fontSize: 12 }}>{message.text}</Text>
                </View>
              ))
            ) : (
              <Text style={{ color: "rgba(220,232,255,0.56)", fontSize: 12 }}>여기서 내리면 바로 할 일과 운영 기록으로 연결돼.</Text>
            )}
          </View>

          <View style={{ marginTop: 8, flexDirection: "row", alignItems: "flex-end", gap: 8 }}>
            <TextInput
              value={worldDraft}
              onChangeText={setWorldDraft}
              placeholder="모라에게 실행 명령 입력"
              placeholderTextColor="rgba(220,232,255,0.46)"
              multiline
              style={{
                flex: 1,
                minHeight: 42,
                maxHeight: 96,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: "rgba(120,157,214,0.45)",
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "#f4f7ff",
                paddingHorizontal: 12,
                paddingVertical: 9,
                textAlignVertical: "center",
              }}
            />
            <Pressable onPress={submitWorldChat} disabled={worldSending || !worldDraft.trim()} style={{ minHeight: 42, minWidth: 58, borderRadius: 18, borderWidth: 1, borderColor: "rgba(86,129,214,0.75)", backgroundColor: "rgba(65,103,184,0.9)", alignItems: "center", justifyContent: "center", opacity: worldSending || !worldDraft.trim() ? 0.5 : 1, paddingHorizontal: 12 }}>
              {worldSending ? <ActivityIndicator color="#ffffff" size="small" /> : <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>전송</Text>}
            </Pressable>
          </View>
        </View>

        <View style={{ marginTop: 10, borderRadius: 14, borderWidth: 1, borderColor: "rgba(148,171,212,0.35)", backgroundColor: "rgba(26,35,52,0.9)", padding: 12, gap: 8 }}>
          <Text style={{ color: "#c9d9f5", fontSize: 12, fontWeight: "700" }}>오늘 목양 운영</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "rgba(242,168,168,0.45)", backgroundColor: "rgba(242,168,168,0.12)", padding: 9 }}>
              <Text style={{ color: "#ffd7d7", fontSize: 11 }}>긴급 돌봄</Text>
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 3 }}>{urgentCount}</Text>
            </View>
            <View style={{ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "rgba(143,224,170,0.45)", backgroundColor: "rgba(143,224,170,0.12)", padding: 9 }}>
              <Text style={{ color: "#d7ffe3", fontSize: 11 }}>기도 요청</Text>
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 3 }}>{prayerCount}</Text>
            </View>
          </View>

          <Pressable onPress={() => router.push("/(tabs)/tasks")} style={{ marginTop: 4, minHeight: 44, borderRadius: 12, borderWidth: 1, borderColor: "rgba(243,208,128,0.55)", backgroundColor: "rgba(243,208,128,0.18)", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#ffeabf", fontWeight: "700" }}>{selected.name} 기준 오늘 실행안 보기</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
