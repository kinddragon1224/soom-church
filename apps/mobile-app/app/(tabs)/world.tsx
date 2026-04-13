import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

import PixelSprite from "../../components/pixel-sprite";
import { fetchAgentGrowthLoops, publishAgentGrowthLoop, type AgentGrowthLoop } from "../../lib/agent-growth-source";
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

function formatLoopTime(isoText: string) {
  const date = new Date(isoText);
  if (Number.isNaN(date.getTime())) return "방금";
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

function statSeed(name: string, shift: number) {
  return (name.charCodeAt(0) + name.length * 17 + shift) % 100;
}

function memberStats(name: string, state: string) {
  const care = state.includes("돌봄") ? 88 : 58 + (statSeed(name, 11) % 25);
  const faith = state.includes("기도") ? 86 : 52 + (statSeed(name, 23) % 30);
  const follow = state.includes("후속") ? 84 : 46 + (statSeed(name, 37) % 36);
  return {
    care: Math.min(100, care),
    faith: Math.min(100, faith),
    follow: Math.min(100, follow),
  };
}

function memberSkillSet(name: string) {
  const key = statSeed(name, 19);
  return [
    { title: "즉시 돌봄", level: 1 + (key % 3), desc: "긴급 상태 목원을 우선 대상으로 지정" },
    { title: "기도 버프", level: 1 + ((key + 1) % 3), desc: "기도 루프 실행 시 안정도 상승" },
    { title: "후속 자동화", level: 1 + ((key + 2) % 3), desc: "후속 연락 대상을 자동 큐잉" },
  ];
}

export default function WorldScreen() {
  const { loading, snapshot, selectedId, setSelectedId, setChatDraft, addRuntimeTask } = useWorldStore();
  const [worldDraft, setWorldDraft] = useState("");
  const [worldSending, setWorldSending] = useState(false);
  const [worldMessages, setWorldMessages] = useState<WorldChatMessage[]>([]);
  const [growthLoops, setGrowthLoops] = useState<AgentGrowthLoop[]>([]);
  const [growthLoading, setGrowthLoading] = useState(false);
  const [growthPublishing, setGrowthPublishing] = useState<Record<string, boolean>>({});
  const [growthPublishStatus, setGrowthPublishStatus] = useState<Record<string, string>>({});
  const [topMode, setTopMode] = useState<"world" | "shepherd">("world");
  const [memberFocusId, setMemberFocusId] = useState<string | null>(null);
  const [memberPanelTab, setMemberPanelTab] = useState<"stat" | "skill" | "synergy">("stat");

  const refreshGrowthLoops = async () => {
    setGrowthLoading(true);
    const loops = await fetchAgentGrowthLoops();
    setGrowthLoops(loops);
    setGrowthLoading(false);
  };

  useEffect(() => {
    refreshGrowthLoops();
  }, []);

  const selected = useMemo(() => {
    if (!snapshot?.worldObjects?.length) return null;
    return snapshot.worldObjects.find((item) => item.id === selectedId) ?? snapshot.worldObjects[0];
  }, [selectedId, snapshot]);

  if (loading || !snapshot || !selected) {
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

  const selectedBadge = stateBadge(selected.state);
  const focusedMember = snapshot.peopleRecords.find((person) => person.id === memberFocusId) ?? snapshot.peopleRecords[0] ?? null;
  const focusedStats = focusedMember ? memberStats(focusedMember.name, focusedMember.state) : null;
  const focusedSkills = focusedMember ? memberSkillSet(focusedMember.name) : [];

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

    if (result.agentGrowth?.suggestedGithubIssue) {
      setWorldMessages((prev) => [
        ...prev,
        { id: `wi-${Date.now()}`, role: "assistant", text: `GitHub 이슈 제안: ${result.agentGrowth?.suggestedGithubIssue}` },
      ]);
    }

    result.actions.forEach((action, index) => {
      addRuntimeTask({
        id: `${action.id}-world-${Date.now()}-${index}`,
        title: action.title,
        due: action.due,
        owner: action.owner,
      });
    });

    await refreshGrowthLoops();
    setWorldSending(false);
  };

  const publishLoop = async (loop: AgentGrowthLoop) => {
    const loopId = loop.agentGrowth?.loopId;
    if (!loopId || growthPublishing[loop.id]) return;

    setGrowthPublishing((prev) => ({ ...prev, [loop.id]: true }));
    const result = await publishAgentGrowthLoop(loopId);

    if (result.ok && result.published) {
      setGrowthPublishStatus((prev) => ({ ...prev, [loop.id]: result.issueUrl ? `GitHub 발행 완료: ${result.issueUrl}` : "GitHub 발행 완료" }));
    } else if (result.ok && result.alreadyPublished) {
      setGrowthPublishStatus((prev) => ({ ...prev, [loop.id]: result.issueUrl ? `이미 발행됨: ${result.issueUrl}` : "이미 발행된 루프야" }));
    } else if (result.ok && !result.published) {
      setGrowthPublishStatus((prev) => ({ ...prev, [loop.id]: `작업 큐 저장 완료 (${result.reason ?? "GitHub 미설정"})` }));
    } else {
      setGrowthPublishStatus((prev) => ({ ...prev, [loop.id]: `발행 실패 (${result.reason ?? "오류"})` }));
    }

    setGrowthPublishing((prev) => ({ ...prev, [loop.id]: false }));
  };

  const urgentCount = snapshot.peopleRecords.filter((p) => p.state.includes("후속") || p.state.includes("돌봄")).length;
  const stableCount = snapshot.peopleRecords.filter((p) => p.state.includes("안정") || p.state.includes("기도")).length;
  const teamPower = 28000 + summary.peopleCount * 1350 + urgentCount * 420;
  const stageLabel = `STAGE ${summary.householdCount}-${summary.objectCount}`;
  const autoReward = `${Math.max(1, stableCount) * 120}M`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: mabiTheme.background }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ color: mabiTheme.textMuted, fontSize: 11, letterSpacing: 2 }}>SOOM WORLD</Text>
        <Text style={{ color: mabiTheme.textPrimary, fontSize: 31, fontWeight: "700", lineHeight: 36, marginTop: 6 }}>목장 월드</Text>
        <Text style={{ color: mabiTheme.textMuted, fontSize: 14, lineHeight: 22, marginTop: 6 }}>마을을 내려보며 오늘 해야 할 돌봄을 고른다.</Text>

        <View style={{ marginTop: 10, borderRadius: 12, borderWidth: 1, borderColor: "rgba(214,178,112,0.55)", backgroundColor: "rgba(24,33,50,0.92)", paddingHorizontal: 10, paddingVertical: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text style={{ color: "#8ea6d2", fontSize: 10 }}>{stageLabel}</Text>
            <Text style={{ color: "#f4f7ff", fontSize: 14, fontWeight: "700" }}>목양 전투력 {teamPower.toLocaleString()}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ color: "#ffd687", fontSize: 11 }}>AFK 수급 +{autoReward}</Text>
            <Text style={{ color: "#c9d9f5", fontSize: 10 }}>후속 {urgentCount} · 안정 {stableCount}</Text>
          </View>
        </View>

        <View style={{ marginTop: 10, alignSelf: "flex-start", borderRadius: 999, borderWidth: 1, borderColor: "rgba(214,178,112,0.55)", backgroundColor: "rgba(214,178,112,0.16)", paddingHorizontal: 12, paddingVertical: 5 }}>
          <Text style={{ color: "#f4e2bf", fontSize: 12 }}>오브젝트 {summary.objectCount} · 가정 {summary.householdCount} · 사람 {summary.peopleCount}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}>
        <View style={{ marginTop: 8, flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={() => setTopMode("world")}
            style={{
              flex: 1,
              minHeight: 42,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: topMode === "world" ? "rgba(214,178,112,0.65)" : "rgba(148,171,212,0.3)",
              backgroundColor: topMode === "world" ? "rgba(214,178,112,0.22)" : "rgba(28,41,62,0.8)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: topMode === "world" ? "#ffeabf" : "#c9d9f5", fontWeight: "700" }}>월드</Text>
          </Pressable>
          <Pressable
            onPress={() => setTopMode("shepherd")}
            style={{
              flex: 1,
              minHeight: 42,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: topMode === "shepherd" ? "rgba(214,178,112,0.65)" : "rgba(148,171,212,0.3)",
              backgroundColor: topMode === "shepherd" ? "rgba(214,178,112,0.22)" : "rgba(28,41,62,0.8)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: topMode === "shepherd" ? "#ffeabf" : "#c9d9f5", fontWeight: "700" }}>목양</Text>
          </Pressable>
        </View>

        {topMode === "world" ? (
          <>
            <View
              style={{
                height: 620,
                marginTop: 8,
                borderRadius: 28,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.08)",
                overflow: "hidden",
                backgroundColor: mabiTheme.mapPanel,
              }}
            >
              <View style={{ position: "absolute", inset: 0, backgroundColor: mabiTheme.mist }} />
              <View style={{ position: "absolute", left: 10, right: 10, top: 10, borderRadius: 10, borderWidth: 1, borderColor: "rgba(143,224,170,0.38)", backgroundColor: "rgba(13,31,24,0.68)", paddingHorizontal: 10, paddingVertical: 6, flexDirection: "row", alignItems: "center", justifyContent: "space-between", zIndex: 10 }}>
                <Text style={{ color: "#d7ffe3", fontSize: 11, fontWeight: "700" }}>AUTO ON · 모라가 루프 실행중</Text>
                <Text style={{ color: "#f4d38e", fontSize: 11 }}>+{autoReward}</Text>
              </View>
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
                  style={{ flex: 1, minHeight: 48, borderWidth: 1, borderColor: "rgba(63,79,88,0.35)", borderRadius: 999, backgroundColor: mabiTheme.parchmentSoft, alignItems: "center", justifyContent: "center" }}
                >
                  <Text style={{ color: "#39454d", fontWeight: "700" }}>채팅 탭으로 열기</Text>
                </Pressable>
              </View>
            </View>
          </>
        ) : (
          <View style={{ marginTop: 10, borderRadius: 18, borderWidth: 1, borderColor: "rgba(120,157,214,0.35)", backgroundColor: "rgba(20,29,45,0.92)", padding: 12, gap: 8 }}>
            <Text style={{ color: "#a9c3ef", fontSize: 12, fontWeight: "700" }}>목양 운영 패널</Text>
            <View style={{ borderRadius: 12, borderWidth: 1, borderColor: "rgba(120,157,214,0.28)", backgroundColor: "rgba(255,255,255,0.04)", padding: 10 }}>
              <Text style={{ color: "#d8e6ff", fontSize: 13, fontWeight: "700" }}>오늘 루프</Text>
              <Text style={{ color: "rgba(216,230,255,0.8)", fontSize: 12, marginTop: 4 }}>후속, 기도, 상태태그를 모라 명령으로 바로 실행</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={{ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "rgba(242,168,168,0.45)", backgroundColor: "rgba(242,168,168,0.12)", padding: 9 }}>
                <Text style={{ color: "#ffd7d7", fontSize: 11 }}>긴급 후속</Text>
                <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "700", marginTop: 3 }}>{snapshot.peopleRecords.filter((p) => p.state.includes("후속") || p.state.includes("돌봄")).length}</Text>
              </View>
              <View style={{ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "rgba(143,224,170,0.45)", backgroundColor: "rgba(143,224,170,0.12)", padding: 9 }}>
                <Text style={{ color: "#d7ffe3", fontSize: 11 }}>안정 상태</Text>
                <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "700", marginTop: 3 }}>{snapshot.peopleRecords.filter((p) => p.state.includes("안정") || p.state.includes("기도")).length}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ marginTop: 12, borderRadius: 18, borderWidth: 1, borderColor: "rgba(120,157,214,0.35)", backgroundColor: "rgba(20,29,45,0.92)", padding: 10 }}>
          <Text style={{ color: "#a9c3ef", fontSize: 11, fontWeight: "700", marginBottom: 8 }}>월드 채팅</Text>

          <View style={{ flexDirection: "row", gap: 6, marginBottom: 7 }}>
            {[
              "모라, 후속 3명 자동배정",
              "모라, 기도 루프 1회 실행",
              "모라, 목양 스탯 낮은 순 정렬",
            ].map((cmd) => (
              <Pressable
                key={cmd}
                onPress={() => setWorldDraft(cmd)}
                style={{ borderRadius: 999, borderWidth: 1, borderColor: "rgba(120,157,214,0.45)", backgroundColor: "rgba(52,86,156,0.38)", paddingHorizontal: 8, paddingVertical: 4 }}
              >
                <Text style={{ color: "#dbe8ff", fontSize: 10 }}>{cmd.replace("모라, ", "")}</Text>
              </Pressable>
            ))}
          </View>

          <View style={{ borderRadius: 12, borderWidth: 1, borderColor: "rgba(120,157,214,0.25)", backgroundColor: "rgba(11,18,29,0.7)", padding: 8, gap: 6, minHeight: 84 }}>
            {worldMessages.length ? (
              worldMessages.slice(-4).map((message) => (
                <View
                  key={message.id}
                  style={{
                    alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "92%",
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: message.role === "user" ? "rgba(86,129,214,0.7)" : "rgba(255,255,255,0.14)",
                    backgroundColor: message.role === "user" ? "rgba(52,86,156,0.72)" : "rgba(255,255,255,0.07)",
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                  }}
                >
                  <Text style={{ color: "#f4f7ff", fontSize: 12, lineHeight: 17 }}>{message.text}</Text>
                </View>
              ))
            ) : (
              <Text style={{ color: "rgba(220,232,255,0.56)", fontSize: 12 }}>여기서 바로 채팅하면 할 일/DB까지 같이 반영돼.</Text>
            )}
          </View>

          <View style={{ marginTop: 8, flexDirection: "row", alignItems: "flex-end", gap: 8 }}>
            <TextInput
              value={worldDraft}
              onChangeText={setWorldDraft}
              placeholder="메시지"
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

            <Pressable
              onPress={submitWorldChat}
              disabled={worldSending || !worldDraft.trim()}
              style={{
                minHeight: 42,
                minWidth: 58,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: "rgba(86,129,214,0.75)",
                backgroundColor: "rgba(65,103,184,0.9)",
                alignItems: "center",
                justifyContent: "center",
                opacity: worldSending || !worldDraft.trim() ? 0.5 : 1,
                paddingHorizontal: 12,
              }}
            >
              {worldSending ? <ActivityIndicator color="#ffffff" size="small" /> : <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>전송</Text>}
            </Pressable>
          </View>
        </View>

        <View style={{ marginTop: 12, borderRadius: 14, borderWidth: 1, borderColor: "rgba(148,171,212,0.35)", backgroundColor: "rgba(26,35,52,0.9)", padding: 12, gap: 8 }}>
          <Text style={{ color: "#c9d9f5", fontSize: 12, fontWeight: "700" }}>목원 관리 · 캐릭터 스탯</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <Text style={{ color: "rgba(216,230,255,0.76)", fontSize: 11 }}>보유 {snapshot.peopleRecords.length}/{Math.max(snapshot.peopleRecords.length, 20)}</Text>
            <View style={{ flexDirection: "row", gap: 6 }}>
              {[
                { label: "ALL" },
                { label: "후속" },
                { label: "기도" },
              ].map((filter, idx) => (
                <View
                  key={filter.label}
                  style={{
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: idx === 0 ? "rgba(243,208,128,0.6)" : "rgba(148,171,212,0.3)",
                    backgroundColor: idx === 0 ? "rgba(243,208,128,0.18)" : "rgba(255,255,255,0.04)",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                >
                  <Text style={{ color: idx === 0 ? "#ffeabf" : "#d8e6ff", fontSize: 10, fontWeight: "700" }}>{filter.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {snapshot.peopleRecords.slice(0, 12).map((person) => {
              const lv = 20 + (statSeed(person.name, 5) % 80);
              const starCount = 2 + (statSeed(person.name, 9) % 4);

              return (
                <Pressable
                  key={person.id}
                  onPress={() => {
                    setMemberFocusId(person.id);
                    setMemberPanelTab("stat");
                  }}
                  style={{
                    width: "31%",
                    minWidth: 96,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: person.id === focusedMember?.id ? "rgba(243,208,128,0.68)" : "rgba(148,171,212,0.28)",
                    backgroundColor: person.id === focusedMember?.id ? "rgba(243,208,128,0.12)" : "rgba(255,255,255,0.04)",
                    overflow: "hidden",
                  }}
                >
                  <View style={{ height: 74, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(121,31,31,0.45)", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.14)" }}>
                    <PixelSprite kind="person" frame={person.id === focusedMember?.id ? "selected" : "normal"} showBadge={true} />
                    <Text style={{ position: "absolute", left: 6, top: 5, color: "#f4f7ff", fontSize: 9, fontWeight: "700" }}>Lv {lv}</Text>
                  </View>
                  <View style={{ paddingHorizontal: 7, paddingVertical: 6, gap: 4 }}>
                    <Text numberOfLines={1} style={{ color: "#f4f7ff", fontSize: 11, fontWeight: "700" }}>{person.name}</Text>
                    <Text style={{ color: "#ffd687", fontSize: 10 }}>{"★".repeat(starCount)}</Text>
                    <Text numberOfLines={1} style={{ color: "rgba(216,230,255,0.72)", fontSize: 9 }}>{person.state}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {focusedMember && focusedStats ? (
            <View style={{ marginTop: 6, borderRadius: 12, borderWidth: 1, borderColor: "rgba(243,208,128,0.5)", backgroundColor: "rgba(11,18,29,0.88)", padding: 10 }}>
              <Text style={{ color: "#ffeabf", fontSize: 11 }}>LV {25 + (statSeed(focusedMember.name, 7) % 30)} · {focusedMember.name}</Text>

              <View style={{ marginTop: 8, flexDirection: "row", gap: 6 }}>
                {[
                  { key: "stat", label: "스탯" },
                  { key: "skill", label: "스킬" },
                  { key: "synergy", label: "상성" },
                ].map((tab) => (
                  <Pressable
                    key={tab.key}
                    onPress={() => setMemberPanelTab(tab.key as "stat" | "skill" | "synergy")}
                    style={{
                      flex: 1,
                      minHeight: 34,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: memberPanelTab === tab.key ? "rgba(243,208,128,0.7)" : "rgba(148,171,212,0.28)",
                      backgroundColor: memberPanelTab === tab.key ? "rgba(243,208,128,0.22)" : "rgba(255,255,255,0.04)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: memberPanelTab === tab.key ? "#ffeabf" : "#d8e6ff", fontSize: 11, fontWeight: "700" }}>{tab.label}</Text>
                  </Pressable>
                ))}
              </View>

              {memberPanelTab === "stat" ? (
                <View style={{ marginTop: 8, gap: 6 }}>
                  {[
                    { label: "돌봄력", value: focusedStats.care, color: "#f2a8a8" },
                    { label: "신앙력", value: focusedStats.faith, color: "#8fe0aa" },
                    { label: "후속력", value: focusedStats.follow, color: "#f4d38e" },
                  ].map((row) => (
                    <View key={`focused-${row.label}`} style={{ gap: 3 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: "rgba(216,230,255,0.86)", fontSize: 10 }}>{row.label}</Text>
                        <Text style={{ color: "rgba(216,230,255,0.86)", fontSize: 10 }}>{row.value}</Text>
                      </View>
                      <View style={{ height: 8, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
                        <View style={{ width: `${row.value}%`, height: "100%", backgroundColor: row.color }} />
                      </View>
                    </View>
                  ))}
                </View>
              ) : null}

              {memberPanelTab === "skill" ? (
                <View style={{ marginTop: 8, gap: 6 }}>
                  {focusedSkills.map((skill) => (
                    <View key={`${focusedMember.id}-${skill.title}`} style={{ borderRadius: 8, borderWidth: 1, borderColor: "rgba(148,171,212,0.28)", backgroundColor: "rgba(255,255,255,0.04)", padding: 8 }}>
                      <Text style={{ color: "#f4f7ff", fontSize: 12, fontWeight: "700" }}>LV {skill.level} · {skill.title}</Text>
                      <Text style={{ color: "rgba(216,230,255,0.78)", fontSize: 11, marginTop: 3 }}>{skill.desc}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              {memberPanelTab === "synergy" ? (
                <View style={{ marginTop: 8, gap: 6 }}>
                  <Text style={{ color: "#d8e6ff", fontSize: 11 }}>최적 조합: {focusedMember.household} + 기도 루프 + 후속 자동화</Text>
                  <Text style={{ color: "rgba(216,230,255,0.74)", fontSize: 11 }}>추천 명령: "모라, {focusedMember.name} 중심으로 오늘 루프 최적화"</Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>

        <View style={{ marginTop: 12, borderRadius: 12, borderWidth: 2, borderColor: "rgba(143,224,170,0.5)", backgroundColor: "rgba(143,224,170,0.1)", padding: 12, gap: 8 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: mabiTheme.pixelSuccess, fontSize: 12, fontWeight: "700" }}>에이전트 성장 로그</Text>
            <Pressable onPress={refreshGrowthLoops} style={{ borderRadius: 8, borderWidth: 1, borderColor: "rgba(143,224,170,0.5)", paddingHorizontal: 8, paddingVertical: 4 }}>
              <Text style={{ color: "#d8ffe5", fontSize: 11 }}>새로고침</Text>
            </Pressable>
          </View>

          {growthLoading ? (
            <Text style={{ color: "rgba(216,255,229,0.7)", fontSize: 12 }}>불러오는 중...</Text>
          ) : growthLoops.length === 0 ? (
            <Text style={{ color: "rgba(216,255,229,0.7)", fontSize: 12 }}>아직 성장 로그가 없어. 월드 채팅을 실행해봐.</Text>
          ) : (
            growthLoops.slice(0, 3).map((loop) => (
              <View key={loop.id} style={{ borderRadius: 8, borderWidth: 1, borderColor: "rgba(143,224,170,0.35)", backgroundColor: "rgba(12,35,24,0.35)", padding: 8 }}>
                <Text style={{ color: "#d8ffe5", fontSize: 11, fontWeight: "700" }}>{formatLoopTime(loop.createdAt)} · {loop.agentGrowth?.title ?? "Agent Loop"}</Text>
                <Text style={{ color: "rgba(216,255,229,0.86)", fontSize: 12, marginTop: 4 }}>{loop.agentGrowth?.summary ?? "요약 없음"}</Text>
                {loop.agentGrowth?.suggestedGithubIssue ? (
                  <Text style={{ color: "rgba(216,255,229,0.72)", fontSize: 11, marginTop: 4 }}>이슈 제안: {loop.agentGrowth.suggestedGithubIssue}</Text>
                ) : null}
                {loop.dbActions?.applied ? (
                  <Text style={{ color: "rgba(216,255,229,0.72)", fontSize: 11, marginTop: 4 }}>
                    DB 반영: {(loop.dbActions.updatedMembers ?? []).join(", ")} · {loop.dbActions.statusTag ?? "상태"}
                  </Text>
                ) : null}

                {loop.agentGrowth?.loopId ? (
                  <View style={{ marginTop: 8, gap: 6 }}>
                    <Pressable
                      onPress={() => publishLoop(loop)}
                      disabled={Boolean(growthPublishing[loop.id]) || Boolean(loop.publish)}
                      style={{
                        alignSelf: "flex-start",
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "rgba(243,208,128,0.55)",
                        backgroundColor: "rgba(243,208,128,0.18)",
                        paddingHorizontal: 9,
                        paddingVertical: 5,
                        opacity: growthPublishing[loop.id] || loop.publish ? 0.6 : 1,
                      }}
                    >
                      <Text style={{ color: "#ffeabf", fontSize: 11, fontWeight: "700" }}>
                        {growthPublishing[loop.id] ? "발행 중..." : loop.publish ? "발행 완료" : "이슈/작업큐 발행"}
                      </Text>
                    </Pressable>

                    {growthPublishStatus[loop.id] ? (
                      <Text style={{ color: "rgba(216,255,229,0.72)", fontSize: 10 }}>{growthPublishStatus[loop.id]}</Text>
                    ) : loop.publish ? (
                      <Text style={{ color: "rgba(216,255,229,0.72)", fontSize: 10 }}>
                        {loop.publish.published
                          ? loop.publish.issueUrl
                            ? `GitHub 발행 완료: ${loop.publish.issueUrl}`
                            : "GitHub 발행 완료"
                          : `작업 큐 저장 완료 (${loop.publish.reason ?? "GitHub 미설정"})`}
                      </Text>
                    ) : null}
                  </View>
                ) : null}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
