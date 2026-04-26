import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Image, PanResponder, Pressable, SafeAreaView, StatusBar, Text, View, type DimensionValue, type ImageSourcePropType } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CHARACTER_ART_STANDARD } from "../../src/components/characters/characterArtGuide";
import { JesusNpcCharacter, type JesusNpcPose } from "../../src/components/characters/JesusNpcCharacter";
import { ShepherdCharacter } from "../../src/components/characters/ShepherdCharacter";
import { getShepherdPose } from "../../src/components/characters/shepherdAssets";
import { getCurrentAccountKey } from "../../lib/auth-bridge";
import { applyMemberLocalCache, getMemberLocalCache, type LocalMember, type MemberLocalCache } from "../../lib/member-local-cache";
import { dailyQuestPool, type DailyQuest } from "../../lib/world-growth-config";
import { buildWorldGrowthSummary } from "../../lib/world-growth-summary";
import { completeWorldQuest, getWorldGrowthState, type WorldGrowthState } from "../../lib/world-growth-store";
import { getWorldNpcLayout, setWorldNpcLayout, type WorldNpcLayout } from "../../lib/world-npc-layout";
import { getWorldSetupState } from "../../lib/world-setup";
import { useWorldStore } from "../../lib/world-store";

const WORLD_LAYER_BG = require("../../assets/world-layers/bg-layer.png");
const WORLD_LAYER_FIG_TREE = require("../../assets/world-layers/fig-tree-layer.png");
const WORLD_LAYER_OBJECTS = require("../../assets/world-layers/ground-objects-layer.png");
const WORLD_PETER_NPC = require("../../assets/world-npcs/peter/peter-idle-a-cutout.png");
const CHARACTER_STAGE_SLOT = CHARACTER_ART_STANDARD.canvas;

type HeaderInfo = {
  churchName: string;
  mokjangName: string;
  shepherdName: string;
};

type HomeCareSignal = {
  total: number;
  prayerCount: number;
  uncheckedCount: number;
  urgentCount: number;
  absentCount: number;
  nextCareName: string | null;
};

function guessShepherdName(accountKey: string | null) {
  if (!accountKey) return "목자";
  const base = accountKey.split("@")[0] ?? accountKey;
  const cleaned = base.replace(/[._-]+/g, " ").trim();
  return cleaned.length ? cleaned : "목자";
}

function hasUsefulNextAction(member: LocalMember) {
  const value = member.nextAction?.trim();
  return Boolean(value && value !== "다음 액션 미정" && value !== "동기화 대기" && value !== "다시 저장 시도");
}

function buildHomeCareSignal(members: LocalMember[]): HomeCareSignal {
  const isPrayer = (member: LocalMember) => member.state.includes("기도") || Boolean(member.prayerRequest?.trim());
  const isUrgent = (member: LocalMember) => member.state.includes("긴급");
  const isAbsent = (member: LocalMember) => member.state.includes("결석");
  const isUnchecked = (member: LocalMember) =>
    isUrgent(member) ||
    isAbsent(member) ||
    member.state.includes("관심") ||
    member.state.includes("돌봄") ||
    member.state.includes("후속") ||
    hasUsefulNextAction(member);

  const priorityMember = members.find(isUrgent) ?? members.find(isAbsent) ?? members.find(isPrayer) ?? members.find(isUnchecked) ?? null;

  return {
    total: members.length,
    prayerCount: members.filter(isPrayer).length,
    uncheckedCount: members.filter(isUnchecked).length,
    urgentCount: members.filter(isUrgent).length,
    absentCount: members.filter(isAbsent).length,
    nextCareName: priorityMember?.name ?? null,
  };
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.06)", justifyContent: "center", paddingHorizontal: 10 }}>
      <Text style={{ color: "rgba(237,244,255,0.54)", fontSize: 10, fontWeight: "800" }}>{label}</Text>
      <Text style={{ marginTop: 2, color: "#f5f8ff", fontSize: 15, fontWeight: "900", fontVariant: ["tabular-nums"] }}>{value}</Text>
    </View>
  );
}

function QuestRow({ quest, index, completed, onComplete }: { quest: DailyQuest; index: number; completed: boolean; onComplete: (quest: DailyQuest) => void }) {
  return (
    <Pressable
      onPress={() => {
        if (completed) {
          router.push(quest.route);
          return;
        }
        onComplete(quest);
      }}
      style={{
        minHeight: 52,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: completed ? "rgba(133,214,169,0.52)" : "rgba(255,255,255,0.1)",
        backgroundColor: completed ? "rgba(21,52,36,0.58)" : "rgba(255,255,255,0.055)",
        justifyContent: "center",
        paddingHorizontal: 11,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View style={{ width: 26, height: 26, borderRadius: 9, alignItems: "center", justifyContent: "center", backgroundColor: completed ? "rgba(133,214,169,0.18)" : "rgba(255,238,190,0.12)" }}>
          <Text style={{ color: completed ? "#dcffe7" : "#ffe9b7", fontSize: 11, fontWeight: "900" }}>{completed ? "✓" : index + 1}</Text>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={{ color: "#f6f9ff", fontSize: 12, fontWeight: "900" }}>{quest.title}</Text>
          <Text numberOfLines={1} style={{ marginTop: 2, color: "rgba(255,238,190,0.72)", fontSize: 10 }}>{completed ? quest.reward : quest.actionLabel}</Text>
        </View>
      </View>
    </Pressable>
  );
}

function WorldNpc({ source, left, top, size, label }: { source: ImageSourcePropType; left: DimensionValue; top: DimensionValue; size: number; label: string }) {
  return (
    <View style={{ position: "absolute", left, top, alignItems: "center", zIndex: 20 }}>
      <Image source={source} style={{ width: size, height: Math.floor(size * 1.4) }} resizeMode="contain" />
      <View style={{ marginTop: -5, borderRadius: 999, borderWidth: 1, borderColor: "rgba(255,238,190,0.28)", backgroundColor: "rgba(22,23,28,0.78)", paddingHorizontal: 7, paddingVertical: 2 }}>
        <Text style={{ color: "#ffecc0", fontSize: 9, fontWeight: "800" }}>{label}</Text>
      </View>
    </View>
  );
}

function RewardChip({ label }: { label: string }) {
  return (
    <View style={{ borderRadius: 999, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", backgroundColor: "rgba(10,16,27,0.64)", paddingHorizontal: 9, paddingVertical: 5 }}>
      <Text style={{ color: "rgba(255,255,255,0.78)", fontSize: 10, fontWeight: "800" }}>{label}</Text>
    </View>
  );
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function DraggableWorldCharacter({
  anchor,
  worldSize,
  size,
  zIndex,
  onMove,
  children,
}: {
  anchor: { nx: number; ny: number };
  worldSize: { width: number; height: number };
  size: number;
  zIndex: number;
  onMove: (next: { nx: number; ny: number }) => void;
  children: ReactNode;
}) {
  const dragStartRef = useRef({ x: 0, y: 0 });
  const maxX = Math.max(1, worldSize.width - size);
  const maxY = Math.max(1, worldSize.height - size);
  const left = clamp01(anchor.nx) * maxX;
  const top = clamp01(anchor.ny) * maxY;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          dragStartRef.current = { x: left, y: top };
        },
        onPanResponderMove: (_, gesture) => {
          const nextX = Math.max(0, Math.min(maxX, dragStartRef.current.x + gesture.dx));
          const nextY = Math.max(0, Math.min(maxY, dragStartRef.current.y + gesture.dy));
          onMove({ nx: nextX / maxX, ny: nextY / maxY });
        },
      }),
    [left, maxX, maxY, onMove, top]
  );

  return (
    <View {...panResponder.panHandlers} style={{ position: "absolute", left, top, width: size, minHeight: size, zIndex }}>
      {children}
    </View>
  );
}

export default function WorldScreen() {
  const insets = useSafeAreaInsets();
  const { loading, snapshot, runtimeTasks, attendanceReward } = useWorldStore();
  const [growthState, setGrowthState] = useState<WorldGrowthState | null>(null);
  const [memberCache, setMemberCache] = useState<MemberLocalCache>({ added: [], removedNames: [], overrides: {}, meetingRecords: [], pastoralRecords: {} });
  const [worldSize, setWorldSize] = useState({ width: 1, height: 1 });
  const [npcLayout, setNpcLayout] = useState<WorldNpcLayout>({
    jesus: { nx: 0.24, ny: 0.58 },
    maria: { nx: 0.57, ny: 0.58 },
    johnBaptist: { nx: 0.28, ny: 0.66 },
    peter: { nx: 0.78, ny: 0.62 },
    johnApostle: { nx: 0.82, ny: 0.68 },
  });
  const [headerInfo, setHeaderInfo] = useState<HeaderInfo>({
    churchName: "우리 교회",
    mokjangName: "우리 목장",
    shepherdName: "목자",
  });

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      const [setup, accountKey, growth, layout] = await Promise.all([
        getWorldSetupState(),
        getCurrentAccountKey(),
        getWorldGrowthState(),
        getWorldNpcLayout(),
      ]);
      if (!mounted) return;

      setHeaderInfo({
        churchName: setup?.churchName || "우리 교회",
        mokjangName: setup?.mokjangName || "우리 목장",
        shepherdName: guessShepherdName(accountKey),
      });
      setGrowthState(growth);
      setNpcLayout(layout);
    };

    void hydrate();

    return () => {
      mounted = false;
    };
  }, []);

  useFocusEffect(
    useMemo(
      () => () => {
        let mounted = true;
        getMemberLocalCache()
          .then((cache) => {
            if (mounted) setMemberCache(cache);
          })
          .catch(() => undefined);
        return () => {
          mounted = false;
        };
      },
      []
    )
  );

  const members = useMemo<LocalMember[]>(() => {
    const remoteMembers: LocalMember[] = (snapshot?.peopleRecords ?? []).map((person) => ({
      id: person.id,
      name: person.name,
      household: person.household,
      state: person.state,
      nextAction: person.nextAction,
    }));
    return applyMemberLocalCache(remoteMembers, memberCache);
  }, [memberCache, snapshot?.peopleRecords]);
  const careSignal = useMemo(() => buildHomeCareSignal(members), [members]);
  const peopleCount = careSignal.total;
  const completedTasks = runtimeTasks.filter((task) => task.completed).length;
  const growth = buildWorldGrowthSummary({ growthState, peopleCount, attendanceReward });
  const shepherdPose = getShepherdPose({
    hasNewPrayerRequests: careSignal.prayerCount > 0,
    hasUncheckedMembers: careSignal.uncheckedCount > 0,
    completedTodayQuest: growth.completedDailyQuests >= growth.dailyQuestCount,
    isLoadingRecommendation: loading,
  });
  const jesusPose: JesusNpcPose = loading
    ? "idle"
    : !peopleCount
      ? "guide"
      : growth.completedDailyQuests >= growth.dailyQuestCount
        ? "joy"
        : careSignal.urgentCount > 0 || careSignal.absentCount > 0 || careSignal.uncheckedCount > 0
          ? "concern"
          : careSignal.prayerCount > 0
            ? "bless"
            : completedTasks > 0
              ? "concern"
              : "guide";
  const nextBrief = useMemo(() => {
    if (loading) return "목장월드를 불러오는 중이에요.";
    if (growthState?.lastRewardText) return `${growthState.lastRewardText} 획득. 양이 반응하고 있어요.`;
    if (!peopleCount) return "목원 한 명을 추가하면 월드가 살아나기 시작해요.";
    if (careSignal.urgentCount > 0) return `긴급 돌봄 ${careSignal.urgentCount}명. ${careSignal.nextCareName ?? "먼저 떠오르는 목원"}부터 살펴보세요.`;
    if (careSignal.absentCount > 0) return `결석 후속 ${careSignal.absentCount}명. 안부 연락으로 이어가면 좋아요.`;
    if (careSignal.prayerCount > 0) return `기도제목 ${careSignal.prayerCount}개가 있어요. 한 사람을 위해 먼저 기도해요.`;
    if (careSignal.uncheckedCount > 0) return `오늘 살필 목원 ${careSignal.uncheckedCount}명. ${careSignal.nextCareName ?? "한 명"}부터 기록해보세요.`;
    if (growth.completedDailyQuests < growth.dailyQuestCount) return `오늘의 목양 ${growth.completedDailyQuests}/${growth.dailyQuestCount}. 하나만 더 기록해도 정원이 자라요.`;
    return "오늘 목양 리듬이 안정적이에요.";
  }, [careSignal, growth.completedDailyQuests, growth.dailyQuestCount, growthState?.lastRewardText, loading, peopleCount]);

  const handleCompleteQuest = (quest: DailyQuest) => {
    const routeParams = quest.route === "/(tabs)/people" ? { quest: quest.id } : undefined;
    completeWorldQuest(quest.id, quest.rewardValue)
      .then(setGrowthState)
      .catch(() => undefined);
    router.push(routeParams ? { pathname: quest.route, params: routeParams } : quest.route);
  };

  const updateNpcAnchor = (key: keyof WorldNpcLayout, next: { nx: number; ny: number }) => {
    setNpcLayout((current) => {
      const updated = { ...current, [key]: next };
      void setWorldNpcLayout(updated);
      return updated;
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#090d14" }}>
      <StatusBar barStyle="light-content" translucent={false} backgroundColor="#090d14" />

      <View style={{ flex: 1, paddingHorizontal: 12, paddingTop: Math.max(6, insets.top + 2), paddingBottom: Math.max(8, insets.bottom + 2), gap: 8 }}>
        <View style={{ minHeight: 86, borderRadius: 16, borderWidth: 1, borderColor: "rgba(140,162,203,0.35)", backgroundColor: "rgba(20,29,45,0.92)", paddingHorizontal: 12, paddingVertical: 10, justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ color: "rgba(235,241,255,0.56)", fontSize: 10, fontWeight: "800", letterSpacing: 1.2 }}>MOKJANG WORLD</Text>
              <Text numberOfLines={1} style={{ marginTop: 3, color: "#f7f9ff", fontSize: 17, fontWeight: "900" }}>{headerInfo.mokjangName}</Text>
              <Text numberOfLines={1} style={{ marginTop: 2, color: "rgba(235,241,255,0.62)", fontSize: 11 }}>{headerInfo.churchName} · {headerInfo.shepherdName}</Text>
            </View>
            <Pressable
              onPress={() => router.push("/world-setup")}
              style={{ minWidth: 48, borderRadius: 999, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", backgroundColor: "rgba(255,255,255,0.06)", paddingHorizontal: 10, paddingVertical: 7, alignItems: "center" }}
            >
              <Text style={{ color: "rgba(245,248,255,0.82)", fontSize: 10, fontWeight: "800" }}>설정</Text>
            </Pressable>
          </View>
        </View>

        <View
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setWorldSize({ width, height });
          }}
          style={{ flex: 1.08, minHeight: 292, borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", backgroundColor: "#111722" }}
        >
          <Image source={WORLD_LAYER_BG} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} resizeMode="cover" />
          <Image source={WORLD_LAYER_FIG_TREE} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} resizeMode="cover" />
          <Image source={WORLD_LAYER_OBJECTS} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} resizeMode="cover" />
          <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(4,7,12,0.08)" }} />

          <View style={{ position: "absolute", left: 12, right: 12, top: 12, flexDirection: "row", justifyContent: "space-between", gap: 6, zIndex: 30 }}>
            <RewardChip label={`씨앗 ${growth.seeds}`} />
            <RewardChip label={`등불 ${growth.lamps}`} />
            <RewardChip label={`배지 ${growth.badges}`} />
          </View>

          <DraggableWorldCharacter anchor={npcLayout.jesus} worldSize={worldSize} size={CHARACTER_STAGE_SLOT} zIndex={28} onMove={(next) => updateNpcAnchor("jesus", next)}>
            <JesusNpcCharacter pose={jesusPose} displaySize={CHARACTER_STAGE_SLOT} />
          </DraggableWorldCharacter>
          <DraggableWorldCharacter anchor={npcLayout.maria} worldSize={worldSize} size={CHARACTER_STAGE_SLOT} zIndex={24} onMove={(next) => updateNpcAnchor("maria", next)}>
            <ShepherdCharacter pose={shepherdPose} size="md" label={growth.shepherdLevel.title} />
          </DraggableWorldCharacter>
          {completedTasks > 0 ? (
            <DraggableWorldCharacter anchor={npcLayout.peter} worldSize={worldSize} size={96} zIndex={22} onMove={(next) => updateNpcAnchor("peter", next)}>
              <WorldNpc source={WORLD_PETER_NPC} left={0} top={0} size={58} label="양" />
            </DraggableWorldCharacter>
          ) : null}

          <View style={{ position: "absolute", left: 12, right: 12, bottom: 8, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,238,190,0.14)", backgroundColor: "rgba(12,17,26,0.66)", paddingHorizontal: 10, paddingVertical: 5, zIndex: 35 }}>
            <Text numberOfLines={1} style={{ color: "rgba(246,249,255,0.82)", fontSize: 10, fontWeight: "800", textAlign: "center" }}>{nextBrief}</Text>
          </View>
        </View>

        <View style={{ flex: 0.92, minHeight: 268, borderRadius: 18, borderWidth: 1, borderColor: "rgba(140,162,203,0.34)", backgroundColor: "rgba(18,26,40,0.94)", padding: 10, gap: 8 }}>
          <View style={{ flexDirection: "row", gap: 7 }}>
            <StatChip label="목자" value={`Lv.${growth.shepherdLevel.level}`} />
            <StatChip label="정원" value={`Lv.${growth.gardenLevel}`} />
            <StatChip label="양 친밀도" value={`${growth.sheepAffinity}`} />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ color: "#e9f1ff", fontSize: 13, fontWeight: "900" }}>오늘의 목양 퀘스트</Text>
              <Text numberOfLines={1} style={{ marginTop: 2, color: "rgba(233,241,255,0.56)", fontSize: 10 }}>{growth.shepherdLevel.title} · 다음 장비: {growth.shepherdLevel.gear}</Text>
            </View>
            <Text style={{ color: "rgba(255,238,190,0.8)", fontSize: 10, fontWeight: "900" }}>{growth.completedDailyQuests}/{growth.dailyQuestCount}</Text>
          </View>

          <View style={{ gap: 6 }}>
            {dailyQuestPool.map((quest, index) => (
              <QuestRow key={quest.id} quest={quest} index={index} completed={growth.completedQuestIds.includes(quest.id)} onComplete={handleCompleteQuest} />
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
