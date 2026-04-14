import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StatusBar, Text, TextInput, View, useWindowDimensions } from "react-native";

import { sendChatCommand } from "../../lib/chat-source";
import { mabiTheme } from "../../lib/ui-theme";
import { WORLD_MVP_TEMPLATE } from "../../lib/world-template";
import { getWorldSetupState, type WorldSetupState } from "../../lib/world-setup";
import { useWorldStore } from "../../lib/world-store";

type WorldChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type WorldCommandPreset = {
  id: string;
  label: string;
  command: string;
  accent: string;
};

const WORLD_COMMAND_PRESETS: WorldCommandPreset[] = [
  {
    id: "followup-today",
    label: "오늘 후속 배정",
    command: "모라, 오늘 후속 필요한 사람 3명 골라서 연락 순서까지 정리해줘",
    accent: "rgba(92, 132, 214, 0.28)",
  },
  {
    id: "prayer-priority",
    label: "기도 우선 정리",
    command: "모라, 기도 요청 들어온 순서대로 오늘 우선순위 정리해줘",
    accent: "rgba(107, 163, 128, 0.26)",
  },
  {
    id: "visit-plan",
    label: "심방 일정 초안",
    command: "모라, 이번 주 심방 필요한 가정 추려서 일정 초안 만들어줘",
    accent: "rgba(187, 133, 90, 0.28)",
  },
  {
    id: "care-alert",
    label: "돌봄 경보 점검",
    command: "모라, 돌봄 경보 있는 목원 먼저 보여주고 오늘 조치안 붙여줘",
    accent: "rgba(183, 96, 112, 0.28)",
  },
  {
    id: "newcomer-followup",
    label: "새가족 후속",
    command: "모라, 새가족이나 정착중인 사람 후속 계획 바로 작성해줘",
    accent: "rgba(120, 157, 214, 0.24)",
  },
  {
    id: "today-brief",
    label: "오늘 목양 브리프",
    command: "모라, 후속 기도 심방 기준으로 오늘 목양 브리프 짧게 정리해줘",
    accent: "rgba(146, 132, 201, 0.26)",
  },
];

const WORLD_LAYER_BG = require("../../assets/world-layers/bg-layer.png");
const WORLD_LAYER_BUILDINGS = require("../../assets/world-layers/buildings-layer.png");
const WORLD_LAYER_FIG_TREE = require("../../assets/world-layers/fig-tree-layer.png");
const WORLD_LAYER_NPCS = require("../../assets/world-layers/npc-disciples-layer.png");
const WORLD_LAYER_OBJECTS = require("../../assets/world-layers/ground-objects-layer.png");
const WORLD_LAYER_CHARACTERS = require("../../assets/world-layers/characters-layer.png");

export default function WorldScreen() {
  const { loading, snapshot, addRuntimeTask, chatDraft, setChatDraft } = useWorldStore();
  const { height: windowHeight } = useWindowDimensions();
  const [worldDraft, setWorldDraft] = useState("");
  const [worldSending, setWorldSending] = useState(false);
  const [worldMessages, setWorldMessages] = useState<WorldChatMessage[]>([]);
  const [worldSetup, setWorldSetup] = useState<WorldSetupState | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const incoming = chatDraft.trim();
    if (!incoming) return;
    setWorldDraft(incoming);
    setChatDraft("");
  }, [chatDraft, setChatDraft]);

  useEffect(() => {
    getWorldSetupState().then((value) => {
      setWorldSetup(value);
    });
  }, []);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const selected = useMemo(() => {
    if (!snapshot?.worldObjects?.length) return null;
    return snapshot.worldObjects[0];
  }, [snapshot]);
  const worldHeight = keyboardVisible
    ? Math.max(170, Math.min(290, Math.floor(windowHeight * 0.28)))
    : Platform.OS === "web"
      ? Math.max(300, Math.min(620, Math.floor(windowHeight * 0.58)))
      : Math.max(280, Math.min(520, Math.floor(windowHeight * 0.54)));

  if (loading || !snapshot || !selected) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: mabiTheme.background, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: mabiTheme.textPrimary }}>목양 월드 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  const urgentCount = snapshot.peopleRecords.filter((p) => p.state.includes("후속") || p.state.includes("돌봄")).length;
  const prayerCount = snapshot.peopleRecords.filter((p) => p.state.includes("기도")).length;
  const recentMessages = worldMessages.slice(-2);
  const latestAssistant = [...worldMessages].reverse().find((message) => message.role === "assistant");
  const afkBrief = latestAssistant?.text ?? `긴급 ${urgentCount}명, 기도 ${prayerCount}건. ${selected.name}부터 확인해줘.`;
  const visiblePresets = WORLD_COMMAND_PRESETS.slice(0, 4);
  const executeCommand = async (text: string, source: "manual" | "auto" = "manual") => {
    const commandTs = Date.now();

    setWorldMessages((prev) => [...prev, { id: `wu-${commandTs}`, role: "user", text }]);

    addRuntimeTask({
      id: `command-log-${commandTs}`,
      title: `[명령 실행] ${text.replace(/^모라,?\s*/, "")}`,
      due: "방금",
      owner: source === "auto" ? "모라 자동 루프" : "모라 명령창",
    });

    const result = await sendChatCommand(text);

    setWorldMessages((prev) => [...prev, { id: `wa-${Date.now()}`, role: "assistant", text: result.reply }]);

    result.actions.forEach((action, index) => {
      addRuntimeTask({
        id: `${action.id}-world-${commandTs}-${index}`,
        title: action.title,
        due: action.due,
        owner: action.owner,
      });
    });
  };

  const submitWorldChat = async () => {
    const text = worldDraft.trim();
    if (!text || worldSending) return;

    setWorldSending(true);
    setWorldDraft("");
    try {
      await executeCommand(text, "manual");
    } catch {
      addRuntimeTask({
        id: `command-fail-${Date.now()}`,
        title: "[명령 실패] 모라 명령 실행 중 오류",
        due: "방금",
        owner: "모라 명령창",
      });
      setWorldMessages((prev) => [...prev, { id: `wa-fail-${Date.now()}`, role: "assistant", text: "명령 실행 중 오류가 났어. 다시 시도해줘." }]);
    } finally {
      setWorldSending(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f0f", paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 0, gap: 6 }}>
        {!keyboardVisible ? (
        <View style={{
          height: worldHeight,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.08)",
          overflow: "hidden",
          backgroundColor: "#131313",
        }}>
          <Image source={WORLD_LAYER_BG} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} resizeMode="cover" />
          <Image source={WORLD_LAYER_BUILDINGS} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.96 }} resizeMode="cover" />
          <Image source={WORLD_LAYER_FIG_TREE} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} resizeMode="cover" />
          <Image source={WORLD_LAYER_NPCS} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.95 }} resizeMode="cover" />
          <Image source={WORLD_LAYER_OBJECTS} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} resizeMode="cover" />
          <Image source={WORLD_LAYER_CHARACTERS} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} resizeMode="cover" />
          <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(8,8,8,0.16)" }} />
          <View style={{ position: "absolute", left: 12, right: 12, top: 12, borderRadius: 12, borderWidth: 1, borderColor: "#2f2f2f", backgroundColor: "rgba(14,14,14,0.72)", paddingHorizontal: 10, paddingVertical: 8, zIndex: 10, gap: 6 }}>
            <Text style={{ color: "rgba(255,234,191,0.86)", fontSize: 10, fontWeight: "700" }}>{WORLD_MVP_TEMPLATE.backgroundStory}</Text>
            <Text style={{ color: "#f4f7ff", fontSize: 12, fontWeight: "700" }}>
              {worldSetup?.churchName ?? "교회 미설정"} · {worldSetup?.mokjangName ?? "목장 미설정"}
            </Text>
            <Text numberOfLines={1} style={{ color: "rgba(245,245,245,0.68)", fontSize: 10 }}>{WORLD_MVP_TEMPLATE.scripture}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              <View style={{ borderRadius: 999, borderWidth: 1, borderColor: "#8a7b54", backgroundColor: "#211d14", paddingHorizontal: 8, paddingVertical: 4 }}>
                <Text style={{ color: "#ffeabf", fontSize: 10 }}>지역 {worldSetup?.region ?? "미설정"}</Text>
              </View>
              <View style={{ borderRadius: 999, borderWidth: 1, borderColor: "#4e6590", backgroundColor: "#18202e", paddingHorizontal: 8, paddingVertical: 4 }}>
                <Text style={{ color: "#d8e7ff", fontSize: 10 }}>목원 {snapshot.peopleRecords.length}명</Text>
              </View>
            </View>
          </View>

          <View style={{ position: "absolute", left: 12, right: 12, bottom: 12, borderRadius: 11, borderWidth: 1, borderColor: "#8a7b54", backgroundColor: "rgba(17,17,17,0.76)", paddingHorizontal: 10, paddingVertical: 8, zIndex: 10 }}>
            <Text style={{ color: "#ffeabf", fontSize: 10, fontWeight: "700" }}>모라 브리프</Text>
            <Text numberOfLines={2} style={{ color: "#f4f7ff", fontSize: 11, marginTop: 3 }}>{afkBrief}</Text>
          </View>

        </View>
        ) : null}

        <View style={{ minHeight: keyboardVisible ? 220 : 170, borderRadius: 16, borderWidth: 1, borderColor: "#2f2f2f", backgroundColor: "#141414", padding: 10, gap: 6 }}>
          <Text style={{ color: "#f4f7ff", fontSize: 14, fontWeight: "700" }}>실행창</Text>

          <View style={{ gap: 6 }}>
            {!keyboardVisible ? (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {visiblePresets.map((preset) => (
                  <Pressable
                    key={preset.id}
                    onPress={() => setWorldDraft(preset.command)}
                    style={{ borderRadius: 999, backgroundColor: preset.accent, paddingHorizontal: 8, paddingVertical: 5 }}
                  >
                    <Text style={{ color: "#dbe8ff", fontSize: 9 }}>{preset.label}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}

            <View style={{ borderRadius: 12, backgroundColor: "#171717", borderWidth: 1, borderColor: "#333", padding: 8, minHeight: keyboardVisible ? 98 : 68, maxHeight: keyboardVisible ? 164 : 112 }}>
              {recentMessages.length ? (
                recentMessages.map((message) => (
                  <View key={message.id} style={{ alignSelf: message.role === "user" ? "flex-end" : "flex-start", maxWidth: "94%", borderRadius: 10, borderWidth: 1, borderColor: message.role === "user" ? "#4f678f" : "#333", backgroundColor: message.role === "user" ? "#1d2736" : "#1c1c1c", paddingHorizontal: 9, paddingVertical: 6, marginTop: 4 }}>
                    <Text style={{ color: "#f4f7ff", fontSize: 11 }}>{message.text}</Text>
                  </View>
                ))
              ) : (
                <Text style={{ color: "rgba(245,245,245,0.56)", fontSize: 11 }}>여기에 모라 응답이 표시돼.</Text>
              )}
            </View>

            <View style={{ flexDirection: "row", alignItems: "stretch", gap: 8 }}>
              <TextInput
                value={worldDraft}
                onChangeText={setWorldDraft}
                placeholder="모라에게 실행 명령 입력"
                placeholderTextColor="rgba(220,232,255,0.46)"
                multiline
                style={{
                  flex: 1,
                minHeight: keyboardVisible ? 70 : 56,
                maxHeight: keyboardVisible ? 132 : 96,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#3a3a3a",
                  backgroundColor: "#121212",
                  color: "#f4f7ff",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  textAlignVertical: "top",
                }}
              />
              <Pressable onPress={submitWorldChat} disabled={worldSending || !worldDraft.trim()} style={{ minHeight: keyboardVisible ? 70 : 56, minWidth: 62, borderRadius: 12, borderWidth: 1, borderColor: "#4f678f", backgroundColor: "#24324a", alignItems: "center", justifyContent: "center", opacity: worldSending || !worldDraft.trim() ? 0.5 : 1, paddingHorizontal: 10 }}>
                {worldSending ? <ActivityIndicator color="#ffffff" size="small" /> : <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>전송</Text>}
              </Pressable>
            </View>
          </View>
        </View>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
