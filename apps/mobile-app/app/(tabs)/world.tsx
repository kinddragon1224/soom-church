import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Image, PanResponder, Pressable, SafeAreaView, StatusBar, Text, View } from "react-native";

import { getWorldNpcLayout, setWorldNpcLayout } from "../../lib/world-npc-layout";
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
  const [worldSize, setWorldSize] = useState({ width: 1, height: 1 });
  const [jesusAnchor, setJesusAnchor] = useState({ nx: 0.5, ny: 0.64 });
  const [mariaAnchor, setMariaAnchor] = useState({ nx: 0.73, ny: 0.64 });
  const [npcReaction, setNpcReaction] = useState<string | null>(null);
  const [npcReactionPos, setNpcReactionPos] = useState<{ left: number; top: number } | null>(null);

  const npcFloat = useRef(new Animated.Value(0)).current;
  const dragStartRef = useRef({ x: 0, y: 0 });
  const mariaDragStartRef = useRef({ x: 0, y: 0 });
  const jesusAnchorRef = useRef(jesusAnchor);
  const mariaAnchorRef = useRef(mariaAnchor);
  const jesusLeftRef = useRef(0);
  const jesusTopRef = useRef(0);
  const mariaLeftRef = useRef(0);
  const mariaTopRef = useRef(0);

  const mariaUnlocked = attendanceReward?.mariaUnlocked ?? false;

  useEffect(() => {
    getWorldNpcLayout()
      .then((layout) => {
        setJesusAnchor(layout.jesus);
        setMariaAnchor(layout.maria);
      })
      .catch(() => undefined);
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

  useEffect(() => {
    jesusAnchorRef.current = jesusAnchor;
  }, [jesusAnchor]);

  useEffect(() => {
    mariaAnchorRef.current = mariaAnchor;
  }, [mariaAnchor]);

  const jesusW = Math.max(52, Math.floor(worldSize.width * 0.078));
  const jesusH = Math.max(78, Math.floor(worldSize.height * 0.098));
  const jesusLeft = clamp01(jesusAnchor.nx) * Math.max(0, worldSize.width - jesusW);
  const jesusTop = clamp01(jesusAnchor.ny) * Math.max(0, worldSize.height - jesusH);

  const mariaW = Math.max(50, Math.floor(jesusW * 0.95));
  const mariaH = Math.max(75, Math.floor(jesusH * 0.95));
  const mariaLeft = clamp01(mariaAnchor.nx) * Math.max(0, worldSize.width - mariaW);
  const mariaTop = clamp01(mariaAnchor.ny) * Math.max(0, worldSize.height - mariaH);

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
      // ignore
    }
  };

  const persistMariaAnchor = async (nx: number, ny: number) => {
    const next = { nx: clamp01(nx), ny: clamp01(ny) };
    setMariaAnchor(next);
    try {
      await setWorldNpcLayout({ jesus: jesusAnchorRef.current, maria: next });
    } catch {
      // ignore
    }
  };

  const reactNpcTouch = () => {
    const messages = ["좋아, 함께 가자.", "오늘도 시작하자.", "필요한 일부터 하자."];
    setNpcReaction(messages[Math.floor(Math.random() * messages.length)]);
    const bubbleLeft = Math.max(8, Math.min(worldSize.width - 170, jesusLeftRef.current - 50));
    const bubbleTop = Math.max(8, jesusTopRef.current - 36);
    setNpcReactionPos({ left: bubbleLeft, top: bubbleTop });
    setTimeout(() => setNpcReaction(null), 1200);
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          dragStartRef.current = { x: jesusLeftRef.current, y: jesusTopRef.current };
        },
        onPanResponderMove: (_, gesture) => {
          const maxX = Math.max(1, worldSize.width - jesusW);
          const maxY = Math.max(1, worldSize.height - jesusH);
          const nextX = Math.max(0, Math.min(maxX, dragStartRef.current.x + gesture.dx));
          const nextY = Math.max(0, Math.min(maxY, dragStartRef.current.y + gesture.dy));
          setJesusAnchor({ nx: nextX / maxX, ny: nextY / maxY });
        },
        onPanResponderRelease: (_, gesture) => {
          if (Math.abs(gesture.dx) + Math.abs(gesture.dy) < 6) reactNpcTouch();
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
        onPanResponderGrant: () => {
          mariaDragStartRef.current = { x: mariaLeftRef.current, y: mariaTopRef.current };
        },
        onPanResponderMove: (_, gesture) => {
          if (!mariaUnlocked) return;
          const maxX = Math.max(1, worldSize.width - mariaW);
          const maxY = Math.max(1, worldSize.height - mariaH);
          const nextX = Math.max(0, Math.min(maxX, mariaDragStartRef.current.x + gesture.dx));
          const nextY = Math.max(0, Math.min(maxY, mariaDragStartRef.current.y + gesture.dy));
          setMariaAnchor({ nx: nextX / maxX, ny: nextY / maxY });
        },
        onPanResponderRelease: () => {
          if (!mariaUnlocked) return;
          void persistMariaAnchor(mariaAnchorRef.current.nx, mariaAnchorRef.current.ny);
        },
      }),
    [mariaH, mariaUnlocked, mariaW, worldSize.height, worldSize.width]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
      <StatusBar barStyle="light-content" />

      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 6 }}>
        <Text style={{ color: "#f5f5f5", fontSize: 16, fontWeight: "700" }}>목장 월드</Text>
        <Text style={{ color: "rgba(245,245,245,0.62)", fontSize: 11 }}>
          {loading ? "불러오는 중..." : `목원 ${snapshot?.peopleRecords.length ?? 0}명`}
        </Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 14, paddingBottom: 10 }}>
        <View
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setWorldSize({ width, height });
          }}
          style={{ flex: 1, borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: "#2f2f2f", backgroundColor: "#111" }}
        >
          <Image source={WORLD_LAYER_BG} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} resizeMode="cover" />
          <Image source={WORLD_LAYER_FIG_TREE} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} resizeMode="cover" />
          <Image source={WORLD_LAYER_NPCS} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} resizeMode="cover" />
          <Image source={WORLD_LAYER_OBJECTS} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} resizeMode="cover" />

          <Animated.View
            {...panResponder.panHandlers}
            style={{ position: "absolute", left: jesusLeft, top: jesusTop, width: jesusW, height: jesusH, transform: [{ translateY: npcFloat }], zIndex: 20 }}
          >
            <Image source={WORLD_JESUS_NPC} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
          </Animated.View>

          {mariaUnlocked ? (
            <Animated.View
              {...mariaPanResponder.panHandlers}
              style={{ position: "absolute", left: mariaLeft, top: mariaTop, width: mariaW, height: mariaH, transform: [{ translateY: npcFloat }], zIndex: 19 }}
            >
              <Image source={WORLD_MARIA_NPC} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
            </Animated.View>
          ) : null}

          {npcReaction && npcReactionPos ? (
            <Pressable style={{ position: "absolute", left: npcReactionPos.left, top: npcReactionPos.top, borderRadius: 999, borderWidth: 1, borderColor: "#6b5a35", backgroundColor: "rgba(33,33,33,0.82)", paddingHorizontal: 10, paddingVertical: 6 }}>
              <Text style={{ color: "#ffeabf", fontSize: 11, fontWeight: "700" }}>{npcReaction}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}
