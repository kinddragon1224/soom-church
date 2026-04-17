import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { mabiTheme } from "../../lib/ui-theme";
import { WORLD_MVP_TEMPLATE } from "../../lib/world-template";
import { getWorldNpcLayout, setWorldNpcLayout } from "../../lib/world-npc-layout";
import { getWorldSetupState, type WorldSetupState } from "../../lib/world-setup";
import { useWorldStore } from "../../lib/world-store";

const WORLD_LAYER_BG = require("../../assets/world-layers/bg-layer.png");
const WORLD_LAYER_FIG_TREE = require("../../assets/world-layers/fig-tree-layer.png");
const WORLD_LAYER_NPCS = require("../../assets/world-layers/npc-disciples-layer.png");
const WORLD_LAYER_OBJECTS = require("../../assets/world-layers/ground-objects-layer.png");
const WORLD_JESUS_NPC = require("../../assets/world-npcs/jesus-npc.png");
const WORLD_MARIA_NPC = require("../../assets/world-npcs/maria/maria-idle-a-cutout.png");

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export default function WorldScreen() {
  const { loading, snapshot, attendanceReward } = useWorldStore();
  const { height: windowHeight } = useWindowDimensions();

  const [worldSetup, setWorldSetup] = useState<WorldSetupState | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [npcReaction, setNpcReaction] = useState<string | null>(null);
  const [panelVisible, setPanelVisible] = useState({ header: true, brief: true });
  const [jesusAnchor, setJesusAnchor] = useState({ nx: 0.5, ny: 0.64 });
  const [mariaAnchor, setMariaAnchor] = useState({ nx: 0.73, ny: 0.59 });
  const [worldSize, setWorldSize] = useState({ width: 1, height: 1 });

  const npcFloat = useRef(new Animated.Value(0)).current;
  const npcPulseScale = useRef(new Animated.Value(0.86)).current;
  const npcPulseOpacity = useRef(new Animated.Value(0)).current;
  const dragStartRef = useRef({ x: 0, y: 0 });
  const mariaDragStartRef = useRef({ x: 0, y: 0 });
  const jesusAnchorRef = useRef(jesusAnchor);
  const mariaAnchorRef = useRef(mariaAnchor);
  const jesusLeftRef = useRef(0);
  const jesusTopRef = useRef(0);
  const mariaLeftRef = useRef(0);
  const mariaTopRef = useRef(0);

  useEffect(() => {
    getWorldSetupState().then(setWorldSetup).catch(() => undefined);
    getWorldNpcLayout()
      .then((layout) => {
        setJesusAnchor(layout.jesus);
        setMariaAnchor(layout.maria);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(npcFloat, { toValue: -2.2, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(npcFloat, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [npcFloat]);

  const selected = useMemo(() => snapshot?.worldObjects?.[0] ?? null, [snapshot]);

  const worldHeight = keyboardVisible
    ? Math.max(170, Math.min(290, Math.floor(windowHeight * 0.28)))
    : Platform.OS === "web"
      ? Math.max(300, Math.min(620, Math.floor(windowHeight * 0.58)))
      : Math.max(280, Math.min(520, Math.floor(windowHeight * 0.54)));

  const urgentCount = snapshot?.peopleRecords?.filter((p) => p.state.includes("후속") || p.state.includes("돌봄")).length ?? 0;
  const prayerCount = snapshot?.peopleRecords?.filter((p) => p.state.includes("기도")).length ?? 0;
  const afkBrief = `긴급 ${urgentCount}명, 기도 ${prayerCount}건. ${selected?.name ?? "오늘 대상"}부터 확인해줘.`;

  const jesusW = Math.max(52, Math.floor(worldSize.width * 0.078));
  const jesusH = Math.max(78, Math.floor(worldSize.height * 0.098));
  const jesusLeft = clamp01(jesusAnchor.nx) * Math.max(0, worldSize.width - jesusW);
  const jesusTop = clamp01(jesusAnchor.ny) * Math.max(0, worldSize.height - jesusH);
  const mariaW = Math.max(50, Math.floor(jesusW * 0.95));
  const mariaH = Math.max(75, Math.floor(jesusH * 0.95));
  const mariaLeft = clamp01(mariaAnchor.nx) * Math.max(0, worldSize.width - mariaW);
  const mariaTop = clamp01(mariaAnchor.ny) * Math.max(0, worldSize.height - mariaH);
  const mariaUnlocked = attendanceReward?.mariaUnlocked ?? false;
  const mariaDaysLeft = Math.max(0, (attendanceReward?.rewardTargetDays ?? 7) - (attendanceReward?.streakCount ?? 0));

  useEffect(() => {
    jesusAnchorRef.current = jesusAnchor;
  }, [jesusAnchor]);

  useEffect(() => {
    mariaAnchorRef.current = mariaAnchor;
  }, [mariaAnchor]);

  useEffect(() => {
    jesusLeftRef.current = jesusLeft;
    jesusTopRef.current = jesusTop;
  }, [jesusLeft, jesusTop]);

  useEffect(() => {
    mariaLeftRef.current = mariaLeft;
    mariaTopRef.current = mariaTop;
  }, [mariaLeft, mariaTop]);

  const persistJesusAnchor = async (nx: number, ny: number) => {
    const next = { nx: clamp01(nx), ny: clamp01(ny) };
    setJesusAnchor(next);
    try {
      await setWorldNpcLayout({ jesus: next, maria: mariaAnchorRef.current });
    } catch {
      // ignore local persistence failure to avoid unhandled promise banner
    }
  };

  const persistMariaAnchor = async (nx: number, ny: number) => {
    const next = { nx: clamp01(nx), ny: clamp01(ny) };
    setMariaAnchor(next);
    try {
      await setWorldNpcLayout({ jesus: jesusAnchorRef.current, maria: next });
    } catch {
      // ignore local persistence failure to avoid unhandled promise banner
    }
  };

  useEffect(() => {
    if (!mariaUnlocked) return;
    if (mariaAnchor.ny >= 0.63) return;
    const next = { nx: mariaAnchor.nx, ny: 0.64 };
    setMariaAnchor(next);
    mariaAnchorRef.current = next;
    void persistMariaAnchor(next.nx, next.ny);
  }, [mariaAnchor.nx, mariaAnchor.ny, mariaUnlocked]);

  const reactNpcTouch = () => {
    const messages = ["좋아, 바로 도울게.", "오늘도 함께 가자.", "지금 필요한 일부터 보자."];
    setNpcReaction(messages[Math.floor(Math.random() * messages.length)]);
    npcPulseScale.setValue(0.86);
    npcPulseOpacity.setValue(0.58);

    Animated.parallel([
      Animated.timing(npcPulseScale, { toValue: 1.28, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(npcPulseOpacity, { toValue: 0, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();

    setTimeout(() => setNpcReaction(null), 1300);
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          dragStartRef.current = { x: jesusLeftRef.current, y: jesusTopRef.current };
        },
        onPanResponderMove: (_, gesture) => {
          const maxX = Math.max(1, worldSize.width - jesusW);
          const maxY = Math.max(1, worldSize.height - jesusH);
          const nextX = Math.max(0, Math.min(maxX, dragStartRef.current.x + gesture.dx));
          const nextY = Math.max(0, Math.min(maxY, dragStartRef.current.y + gesture.dy));
          const nextAnchor = { nx: nextX / maxX, ny: nextY / maxY };
          jesusAnchorRef.current = nextAnchor;
          setJesusAnchor(nextAnchor);
        },
        onPanResponderRelease: (_, gesture) => {
          if (Math.abs(gesture.dx) + Math.abs(gesture.dy) < 6) {
            reactNpcTouch();
          }
          void persistJesusAnchor(jesusAnchorRef.current.nx, jesusAnchorRef.current.ny);
        },
      }),
    [jesusH, jesusW, worldSize.height, worldSize.width]
  );

  const mariaPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => mariaUnlocked,
        onMoveShouldSetPanResponder: () => mariaUnlocked,
        onStartShouldSetPanResponderCapture: () => mariaUnlocked,
        onMoveShouldSetPanResponderCapture: () => mariaUnlocked,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          mariaDragStartRef.current = { x: mariaLeftRef.current, y: mariaTopRef.current };
        },
        onPanResponderMove: (_, gesture) => {
          if (!mariaUnlocked) return;
          const maxX = Math.max(1, worldSize.width - mariaW);
          const maxY = Math.max(1, worldSize.height - mariaH);
          const nextX = Math.max(0, Math.min(maxX, mariaDragStartRef.current.x + gesture.dx));
          const nextY = Math.max(0, Math.min(maxY, mariaDragStartRef.current.y + gesture.dy));
          const nextAnchor = { nx: nextX / maxX, ny: nextY / maxY };
          mariaAnchorRef.current = nextAnchor;
          setMariaAnchor(nextAnchor);
        },
        onPanResponderRelease: () => {
          if (!mariaUnlocked) return;
          void persistMariaAnchor(mariaAnchorRef.current.nx, mariaAnchorRef.current.ny);
        },
      }),
    [mariaH, mariaUnlocked, mariaW, worldSize.height, worldSize.width]
  );

  if (loading || !snapshot || !selected) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: mabiTheme.background, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: mabiTheme.textPrimary }}>목양 월드 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f0f", paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}>
        <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 0, gap: 6 }}>
          {!keyboardVisible ? (
            <View
              onLayout={(e) => setWorldSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
              style={{ height: worldHeight, borderRadius: 22, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", overflow: "hidden", backgroundColor: "#131313" }}
            >
              <Image source={WORLD_LAYER_BG} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} resizeMode="cover" />
              <Image source={WORLD_LAYER_FIG_TREE} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} resizeMode="cover" />
              <Image source={WORLD_LAYER_NPCS} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} resizeMode="cover" />
              <Image source={WORLD_LAYER_OBJECTS} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} resizeMode="cover" />

              <Animated.View style={{ position: "absolute", left: jesusLeft, top: jesusTop, width: jesusW, height: jesusH, zIndex: 13 }} {...panResponder.panHandlers}>
                <View
                  style={{
                    position: "absolute",
                    left: "18%",
                    right: "18%",
                    bottom: -2,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: "rgba(0,0,0,0.18)",
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Image source={WORLD_JESUS_NPC} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                </View>
                <Animated.View
                  pointerEvents="none"
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: 72,
                    height: 72,
                    marginLeft: -36,
                    marginTop: -36,
                    borderRadius: 999,
                    borderWidth: 2,
                    borderColor: "rgba(255,234,191,0.95)",
                    opacity: npcPulseOpacity,
                    transform: [{ scale: npcPulseScale }],
                  }}
                />
              </Animated.View>

              {mariaUnlocked ? (
                <View
                  {...mariaPanResponder.panHandlers}
                  style={{
                    position: "absolute",
                    left: mariaLeft,
                    top: mariaTop,
                    width: mariaW,
                    height: mariaH,
                    zIndex: 13,
                  }}
                >
                  <View
                    style={{
                      position: "absolute",
                      left: "18%",
                      right: "18%",
                      bottom: -2,
                      height: 8,
                      borderRadius: 999,
                      backgroundColor: "rgba(0,0,0,0.18)",
                    }}
                  />
                  <Image source={WORLD_MARIA_NPC} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                </View>
              ) : null}

              {!mariaUnlocked ? (
                <View
                  style={{
                    position: "absolute",
                    right: 12,
                    bottom: 90,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "rgba(255,234,191,0.55)",
                    backgroundColor: "rgba(22,22,22,0.72)",
                    paddingHorizontal: 9,
                    paddingVertical: 6,
                    zIndex: 21,
                  }}
                >
                  <Text style={{ color: "#ffeabf", fontSize: 10, fontWeight: "700" }}>7일 출석 보상: 마리아 NPC</Text>
                  <Text style={{ color: "rgba(245,245,245,0.8)", fontSize: 10, marginTop: 2 }}>남은 일수 {mariaDaysLeft}일</Text>
                </View>
              ) : null}


              {panelVisible.header ? (
                <View style={{ position: "absolute", left: 12, right: 12, top: 12, borderRadius: 12, borderWidth: 1, borderColor: "#2f2f2f", backgroundColor: "rgba(14,14,14,0.72)", paddingHorizontal: 10, paddingVertical: 8, zIndex: 20, gap: 6 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ color: "rgba(255,234,191,0.86)", fontSize: 10, fontWeight: "700" }}>{WORLD_MVP_TEMPLATE.backgroundStory}</Text>
                    <Pressable onPress={() => setPanelVisible((prev) => ({ ...prev, header: false }))} style={{ borderRadius: 999, borderWidth: 1, borderColor: "#3d4d70", backgroundColor: "rgba(22,32,46,0.78)", paddingHorizontal: 8, paddingVertical: 2 }}>
                      <Text style={{ color: "#d8e7ff", fontSize: 10, fontWeight: "700" }}>X</Text>
                    </Pressable>
                  </View>
                  <Text style={{ color: "#f4f7ff", fontSize: 12, fontWeight: "700" }}>{worldSetup?.churchName ?? "교회 미설정"} · {worldSetup?.mokjangName ?? "목장 미설정"}</Text>
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
              ) : null}

              {panelVisible.brief ? (
                <View style={{ position: "absolute", left: 12, right: 12, bottom: 12, borderRadius: 11, borderWidth: 1, borderColor: "#8a7b54", backgroundColor: "rgba(17,17,17,0.76)", paddingHorizontal: 10, paddingVertical: 8, zIndex: 20 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ color: "#ffeabf", fontSize: 10, fontWeight: "700" }}>모라 브리프</Text>
                    <Pressable onPress={() => setPanelVisible((prev) => ({ ...prev, brief: false }))} style={{ borderRadius: 999, borderWidth: 1, borderColor: "#6b5d3a", backgroundColor: "rgba(33,29,20,0.74)", paddingHorizontal: 8, paddingVertical: 2 }}>
                      <Text style={{ color: "#ffeabf", fontSize: 10, fontWeight: "700" }}>X</Text>
                    </Pressable>
                  </View>
                  <Text numberOfLines={2} style={{ color: "#f4f7ff", fontSize: 11, marginTop: 3 }}>{afkBrief}</Text>
                </View>
              ) : null}

              {npcReaction ? (
                <View style={{ position: "absolute", left: 16, right: 16, bottom: 88, alignItems: "center", zIndex: 23 }}>
                  <View style={{ borderRadius: 999, borderWidth: 1, borderColor: "rgba(255,234,191,0.65)", backgroundColor: "rgba(24,24,24,0.86)", paddingHorizontal: 12, paddingVertical: 6 }}>
                    <Text style={{ color: "#ffeabf", fontSize: 11, fontWeight: "700" }}>{npcReaction}</Text>
                  </View>
                </View>
              ) : null}
            </View>
          ) : null}

          <View style={{ minHeight: keyboardVisible ? 160 : 136, marginBottom: Platform.OS === "android" ? -10 : 0, borderRadius: 16, borderWidth: 1, borderColor: "#2f2f2f", backgroundColor: "#141414", padding: 10, gap: 8 }}>
            <Text style={{ color: "#f4f7ff", fontSize: 14, fontWeight: "700" }}>운영 패널</Text>
            <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
              <Pressable onPress={() => setPanelVisible((prev) => ({ ...prev, header: !prev.header }))} style={{ borderRadius: 999, borderWidth: 1, borderColor: panelVisible.header ? "#5aa36f" : "#3a3a3a", backgroundColor: panelVisible.header ? "#152419" : "#171717", paddingHorizontal: 8, paddingVertical: 4 }}>
                <Text style={{ color: panelVisible.header ? "#d7ffe3" : "#d0d0d0", fontSize: 10, fontWeight: "700" }}>상단정보 {panelVisible.header ? "ON" : "OFF"}</Text>
              </Pressable>
              <Pressable onPress={() => setPanelVisible((prev) => ({ ...prev, brief: !prev.brief }))} style={{ borderRadius: 999, borderWidth: 1, borderColor: panelVisible.brief ? "#8a7b54" : "#3a3a3a", backgroundColor: panelVisible.brief ? "#211d14" : "#171717", paddingHorizontal: 8, paddingVertical: 4 }}>
                <Text style={{ color: panelVisible.brief ? "#ffeabf" : "#d0d0d0", fontSize: 10, fontWeight: "700" }}>브리프 {panelVisible.brief ? "ON" : "OFF"}</Text>
              </Pressable>
            </View>
            <View style={{ borderRadius: 12, backgroundColor: "#171717", borderWidth: 1, borderColor: "#333", padding: 9, gap: 6 }}>
              <Text style={{ color: "#d8e7ff", fontSize: 10, fontWeight: "700" }}>MVP 모드</Text>
              <Text style={{ color: "rgba(216,231,255,0.78)", fontSize: 11 }}>채팅 기능은 제거했고, 목원 탭 수동 관리 중심으로 운영해.</Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
