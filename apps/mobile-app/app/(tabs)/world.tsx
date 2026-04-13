import { useMemo } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";

import PixelSprite from "../../components/pixel-sprite";
import { type WorldObject } from "../../lib/world-model";
import { mabiTheme } from "../../lib/ui-theme";
import { useWorldStore } from "../../lib/world-store";

function tone(kind: WorldObject["kind"], active: boolean) {
  if (kind === "hub") {
    return {
      bg: active ? "#c99a4d" : "#9f7740",
      border: "#f3ddb0",
      text: "#fff8ea",
    };
  }

  if (kind === "house") {
    return {
      bg: active ? "#4c5f63" : "#3b4a4f",
      border: active ? "#d9e7df" : "#9db1a7",
      text: "#f8f5ed",
    };
  }

  return {
    bg: active ? "#4e86a8" : "#3e6e8c",
    border: active ? "#d3e6f3" : "#9fbfd5",
    text: "#f8f5ed",
  };
}

export default function WorldScreen() {
  const { loading, snapshot, selectedId, setSelectedId, setChatDraft } = useWorldStore();

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
    taskCount: snapshot.taskRecords.length,
  };

  const selected = useMemo(() => {
    return snapshot.worldObjects.find((item) => item.id === selectedId) ?? snapshot.worldObjects[0];
  }, [selectedId, snapshot.worldObjects]);

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
                <PixelSprite kind={item.kind} pixel={3} />
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
          <Text style={{ color: "#59462f", marginTop: 6, lineHeight: 20 }}>{selected.note}</Text>

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
              <Text style={{ color: "#39454d", fontWeight: "700" }}>채팅으로 열기</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
