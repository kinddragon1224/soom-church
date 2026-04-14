import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, Text, TextInput, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";

import { sendChatCommand } from "../../lib/chat-source";
import { mabiTheme } from "../../lib/ui-theme";
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
const WORLD_LAYER_OBJECTS = require("../../assets/world-layers/ground-objects-layer.png");
const WORLD_LAYER_CHARACTERS = require("../../assets/world-layers/characters-layer.png");

export default function WorldScreen() {
  const { loading, snapshot, addRuntimeTask, chatDraft, setChatDraft } = useWorldStore();
  const { height: windowHeight } = useWindowDimensions();
  const [worldDraft, setWorldDraft] = useState("");
  const [worldSending, setWorldSending] = useState(false);
  const [worldMessages, setWorldMessages] = useState<WorldChatMessage[]>([]);
  const [autoRunning, setAutoRunning] = useState(false);
  const [worldSetup, setWorldSetup] = useState<WorldSetupState | null>(null);

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

  const selected = useMemo(() => {
    if (!snapshot?.worldObjects?.length) return null;
    return snapshot.worldObjects[0];
  }, [snapshot]);
  const worldHeight = Math.max(340, Math.min(560, Math.floor(windowHeight * 0.56)));

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
  const recentMessages = worldMessages.slice(-2);
  const latestAssistant = [...worldMessages].reverse().find((message) => message.role === "assistant");
  const afkBrief = latestAssistant?.text ?? `긴급 ${urgentCount}명, 기도 ${prayerCount}건. ${selected.name}부터 확인해줘.`;
  const visiblePresets = WORLD_COMMAND_PRESETS.slice(0, 4);
  const loopCommands = [
    `모라, ${selected.name} 포함 후속 우선순위 3명 정리`,
    "모라, 오늘 기도 요청 목록을 긴급도 순으로 재정렬",
    "모라, 오늘 목양 운영 브리프 3줄로 작성",
  ];

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
    if (!text || worldSending || autoRunning) return;

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

  const runAutoLoop = async () => {
    if (autoRunning || worldSending) return;
    setAutoRunning(true);

    addRuntimeTask({
      id: `auto-loop-start-${Date.now()}`,
      title: "[자동 루프] 오늘 목양 자동 루프 시작",
      due: "방금",
      owner: "모라 자동 루프",
    });

    try {
      for (const command of loopCommands) {
        // eslint-disable-next-line no-await-in-loop
        await executeCommand(command, "auto");
      }

      addRuntimeTask({
        id: `auto-loop-done-${Date.now()}`,
        title: "[자동 루프] 오늘 목양 자동 루프 완료",
        due: "방금",
        owner: "모라 자동 루프",
      });
    } catch {
      addRuntimeTask({
        id: `auto-loop-fail-${Date.now()}`,
        title: "[자동 루프 실패] 일부 명령 실행 중 오류",
        due: "방금",
        owner: "모라 자동 루프",
      });
      setWorldMessages((prev) => [...prev, { id: `wa-auto-fail-${Date.now()}`, role: "assistant", text: "자동 루프 실행 중 오류가 나서 중단했어. 다시 실행해줘." }]);
    } finally {
      setAutoRunning(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: mabiTheme.background, paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0 }}>
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, gap: 10 }}>
        <View style={{
          height: worldHeight,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.08)",
          overflow: "hidden",
          backgroundColor: mabiTheme.mapPanel,
        }}>
          <Image source={WORLD_LAYER_BG} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} resizeMode="cover" />
          <Image source={WORLD_LAYER_BUILDINGS} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.96 }} resizeMode="cover" />
          <Image source={WORLD_LAYER_OBJECTS} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} resizeMode="cover" />
          <Image source={WORLD_LAYER_CHARACTERS} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} resizeMode="cover" />
          <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(20,24,38,0.12)" }} />
          <View style={{ position: "absolute", left: 12, right: 12, top: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(120,157,214,0.22)", backgroundColor: "rgba(15,22,34,0.66)", paddingHorizontal: 10, paddingVertical: 8, zIndex: 10, gap: 6 }}>
            <Text style={{ color: "#f4f7ff", fontSize: 13, fontWeight: "700" }}>오늘 목양 메인</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={{ flex: 1, borderRadius: 10, backgroundColor: "rgba(242,168,168,0.1)", paddingHorizontal: 9, paddingVertical: 6 }}>
                <Text style={{ color: "#ffd7d7", fontSize: 10 }}>긴급 돌봄</Text>
                <Text style={{ color: "#ffffff", fontSize: 15, fontWeight: "700", marginTop: 1 }}>{urgentCount}</Text>
              </View>
              <View style={{ flex: 1, borderRadius: 10, backgroundColor: "rgba(143,224,170,0.1)", paddingHorizontal: 9, paddingVertical: 6 }}>
                <Text style={{ color: "#d7ffe3", fontSize: 10 }}>기도 요청</Text>
                <Text style={{ color: "#ffffff", fontSize: 15, fontWeight: "700", marginTop: 1 }}>{prayerCount}</Text>
              </View>
              <View style={{ flex: 1, borderRadius: 10, backgroundColor: "rgba(120,157,214,0.1)", paddingHorizontal: 9, paddingVertical: 6 }}>
                <Text style={{ color: "#cfe0ff", fontSize: 10 }}>운영 지수</Text>
                <Text style={{ color: "#ffffff", fontSize: 15, fontWeight: "700", marginTop: 1 }}>{operationIndex}</Text>
              </View>
            </View>
          </View>

          <View style={{ position: "absolute", left: 12, right: 12, bottom: 12, borderRadius: 11, borderWidth: 1, borderColor: "rgba(243,208,128,0.35)", backgroundColor: "rgba(22,30,45,0.74)", paddingHorizontal: 10, paddingVertical: 8, zIndex: 10 }}>
            <Text style={{ color: "#ffeabf", fontSize: 10, fontWeight: "700" }}>모라 브리프</Text>
            <Text numberOfLines={2} style={{ color: "#f4f7ff", fontSize: 11, marginTop: 3 }}>{afkBrief}</Text>
          </View>

        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 10, paddingBottom: 24 }}>
          {worldSetup ? (
            <View style={{ borderRadius: 14, borderWidth: 1, borderColor: "rgba(243,208,128,0.35)", backgroundColor: "rgba(46,38,22,0.55)", padding: 12, gap: 8 }}>
              <Text style={{ color: "#ffeabf", fontSize: 13, fontWeight: "800" }}>{worldSetup.mokjangName} 시작 액션</Text>
              <Text style={{ color: "rgba(255,240,205,0.76)", fontSize: 11 }}>{worldSetup.churchName} · {worldSetup.region} | 목원 시작 방식: {worldSetup.memberSource === "csv" ? "CSV" : worldSetup.memberSource === "chat" ? "모라 명령" : "직접 입력"}</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 2 }}>
                <Pressable onPress={() => router.push("/(tabs)/people")} style={{ borderRadius: 999, backgroundColor: "rgba(243,208,128,0.16)", paddingHorizontal: 9, paddingVertical: 5 }}>
                  <Text style={{ color: "#ffeabf", fontSize: 10 }}>이번주 출석 체크</Text>
                </Pressable>
                <Pressable onPress={() => setWorldDraft("모라, 긴급 기도와 돌봄 대상 먼저 정리해줘")} style={{ borderRadius: 999, backgroundColor: "rgba(243,208,128,0.16)", paddingHorizontal: 9, paddingVertical: 5 }}>
                  <Text style={{ color: "#ffeabf", fontSize: 10 }}>긴급 기도/돌봄 정리</Text>
                </Pressable>
                <Pressable onPress={() => setWorldDraft("모라, 이번 주 심방 예정 일정 초안 작성해줘")} style={{ borderRadius: 999, backgroundColor: "rgba(243,208,128,0.16)", paddingHorizontal: 9, paddingVertical: 5 }}>
                  <Text style={{ color: "#ffeabf", fontSize: 10 }}>심방 일정 초안</Text>
                </Pressable>
                <Pressable onPress={() => router.push("/(tabs)/tasks")} style={{ borderRadius: 999, backgroundColor: "rgba(243,208,128,0.16)", paddingHorizontal: 9, paddingVertical: 5 }}>
                  <Text style={{ color: "#ffeabf", fontSize: 10 }}>목장 일정 기입</Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          <View style={{ borderRadius: 16, borderWidth: 1, borderColor: "rgba(120,157,214,0.5)", backgroundColor: "rgba(20,29,45,0.95)", padding: 12 }}>
            <Text style={{ color: "#f4f7ff", fontSize: 14, fontWeight: "700" }}>모라 명령창</Text>

            <View style={{ marginTop: 8, borderRadius: 10, borderWidth: 1, borderColor: "rgba(143,224,170,0.4)", backgroundColor: "rgba(12,35,24,0.38)", padding: 8, gap: 6 }}>
              <Text style={{ color: "#d7ffe3", fontSize: 11, fontWeight: "700" }}>운영 루프 자동화</Text>
              <Text style={{ color: "rgba(216,255,229,0.72)", fontSize: 10 }}>후속/기도/브리프 명령 3개를 순차 실행</Text>
              <Pressable
                onPress={runAutoLoop}
                disabled={autoRunning || worldSending}
                style={{
                  minHeight: 36,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "rgba(143,224,170,0.52)",
                  backgroundColor: "rgba(143,224,170,0.16)",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: autoRunning || worldSending ? 0.5 : 1,
                }}
              >
                <Text style={{ color: "#d7ffe3", fontWeight: "700" }}>{autoRunning ? "자동 루프 실행 중..." : "오늘 자동 루프 실행"}</Text>
              </Pressable>
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8, marginBottom: 8 }}>
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

            <View style={{ borderRadius: 12, backgroundColor: "rgba(11,18,29,0.78)", padding: 9, gap: 6, minHeight: 62, maxHeight: 120 }}>
              {recentMessages.length ? (
                recentMessages.map((message) => (
                  <View key={message.id} style={{ alignSelf: message.role === "user" ? "flex-end" : "flex-start", maxWidth: "92%", borderRadius: 14, borderWidth: 1, borderColor: message.role === "user" ? "rgba(86,129,214,0.7)" : "rgba(255,255,255,0.14)", backgroundColor: message.role === "user" ? "rgba(52,86,156,0.72)" : "rgba(255,255,255,0.07)", paddingHorizontal: 10, paddingVertical: 7 }}>
                    <Text style={{ color: "#f4f7ff", fontSize: 12 }}>{message.text}</Text>
                  </View>
                ))
              ) : (
                <Text style={{ color: "rgba(220,232,255,0.56)", fontSize: 12 }}>후속, 기도, 심방 중 하나만 바로 지시해줘.</Text>
              )}
            </View>

            <View style={{ marginTop: 10, flexDirection: "row", alignItems: "stretch", gap: 8 }}>
              <TextInput
                value={worldDraft}
                onChangeText={setWorldDraft}
                placeholder="모라에게 실행 명령 입력"
                placeholderTextColor="rgba(220,232,255,0.46)"
                multiline
                style={{
                  flex: 1,
                  minHeight: 52,
                  maxHeight: 110,
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: "rgba(120,157,214,0.45)",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "#f4f7ff",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  textAlignVertical: "top",
                }}
              />
              <Pressable onPress={submitWorldChat} disabled={worldSending || autoRunning || !worldDraft.trim()} style={{ minHeight: 52, minWidth: 62, borderRadius: 18, borderWidth: 1, borderColor: "rgba(86,129,214,0.75)", backgroundColor: "rgba(65,103,184,0.9)", alignItems: "center", justifyContent: "center", opacity: worldSending || autoRunning || !worldDraft.trim() ? 0.5 : 1, paddingHorizontal: 10 }}>
                {worldSending ? <ActivityIndicator color="#ffffff" size="small" /> : <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>{autoRunning ? "대기" : "전송"}</Text>}
              </Pressable>
            </View>
          </View>

          <View style={{ borderRadius: 14, borderWidth: 1, borderColor: "rgba(148,171,212,0.35)", backgroundColor: "rgba(26,35,52,0.9)", padding: 12, gap: 10 }}>
            <Text style={{ color: "#f4f7ff", fontSize: 14, fontWeight: "700" }}>오늘 운영</Text>

            <View style={{ borderRadius: 12, backgroundColor: "rgba(255,255,255,0.04)", padding: 10, gap: 8 }}>
              <View>
                <Text style={{ color: "#ffeabf", fontSize: 11, fontWeight: "700" }}>지금 볼 대상</Text>
                <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "700", marginTop: 3 }}>{selected.name}</Text>
                <Text style={{ color: "rgba(220,232,255,0.72)", fontSize: 12, marginTop: 2 }}>{selected.state}</Text>
              </View>

              <View style={{ flexDirection: "row", gap: 8 }}>
                <View style={{ flex: 1, borderRadius: 10, backgroundColor: "rgba(243,208,128,0.08)", paddingHorizontal: 10, paddingVertical: 8 }}>
                  <Text style={{ color: "rgba(255,234,191,0.72)", fontSize: 10 }}>긴급</Text>
                  <Text style={{ color: "#ffffff", fontSize: 15, fontWeight: "700", marginTop: 2 }}>{urgentCount}</Text>
                </View>
                <View style={{ flex: 1, borderRadius: 10, backgroundColor: "rgba(120,157,214,0.08)", paddingHorizontal: 10, paddingVertical: 8 }}>
                  <Text style={{ color: "rgba(207,224,255,0.72)", fontSize: 10 }}>운영</Text>
                  <Text style={{ color: "#ffffff", fontSize: 15, fontWeight: "700", marginTop: 2 }}>{operationIndex}</Text>
                </View>
              </View>
            </View>

            <Pressable onPress={() => router.push("/(tabs)/tasks")} style={{ minHeight: 46, borderRadius: 12, borderWidth: 1, borderColor: "rgba(243,208,128,0.55)", backgroundColor: "rgba(243,208,128,0.18)", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "#ffeabf", fontWeight: "700" }}>오늘 실행안 보기</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
