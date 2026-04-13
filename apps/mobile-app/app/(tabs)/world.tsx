import { useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import { worldObjects, type WorldObject } from "../../lib/world-model";
import { getWorldSummary } from "../../lib/world-summary";

function tone(kind: WorldObject["kind"], active: boolean) {
  if (kind === "hub") {
    return {
      bg: active ? "#f59e0b" : "#d97706",
      border: "#fde68a",
      text: "#fff8dc",
    };
  }

  if (kind === "house") {
    return {
      bg: active ? "#334155" : "#1f2937",
      border: active ? "#cbd5e1" : "#64748b",
      text: "#ffffff",
    };
  }

  return {
    bg: active ? "#2563eb" : "#1d4ed8",
    border: active ? "#bfdbfe" : "#93c5fd",
    text: "#ffffff",
  };
}

export default function WorldScreen() {
  const [selectedId, setSelectedId] = useState("hub");
  const summary = getWorldSummary();

  const selected = useMemo(() => {
    return worldObjects.find((item) => item.id === selectedId) ?? worldObjects[0];
  }, [selectedId]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#07111f" }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ color: "rgba(255,255,255,0.46)", fontSize: 11, letterSpacing: 2 }}>SOOM WORLD</Text>
        <Text style={{ color: "#fff", fontSize: 31, fontWeight: "700", lineHeight: 36, marginTop: 6 }}>목장 월드</Text>
        <Text style={{ color: "rgba(255,255,255,0.68)", fontSize: 14, lineHeight: 22, marginTop: 6 }}>
          아래로 스크롤하면서 상태를 읽고, 오브젝트를 탭해 오늘 행동을 고른다.
        </Text>

        <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 8 }}>
          오브젝트 {summary.objectCount} · 가정 {summary.householdCount} · 사람 {summary.peopleCount} · 할 일 {summary.taskCount}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}>
        <View
          style={{
            height: 620,
            borderRadius: 28,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
            overflow: "hidden",
            backgroundColor: "#13253c",
          }}
        >
          <View style={{ position: "absolute", left: 18, top: 110, width: 140, height: 4, borderRadius: 999, backgroundColor: "rgba(202,191,159,0.5)", transform: [{ rotate: "11deg" }] }} />
          <View style={{ position: "absolute", right: 30, top: 250, width: 128, height: 4, borderRadius: 999, backgroundColor: "rgba(202,191,159,0.5)", transform: [{ rotate: "-16deg" }] }} />
          <View style={{ position: "absolute", left: 120, bottom: 130, width: 120, height: 4, borderRadius: 999, backgroundColor: "rgba(202,191,159,0.5)" }} />

          {worldObjects.map((item) => {
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
                  minWidth: item.kind === "person" ? 74 : 96,
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.bg,
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOpacity: isActive ? 0.32 : 0.12,
                  shadowRadius: isActive ? 9 : 4,
                  shadowOffset: { width: 0, height: 3 },
                  elevation: isActive ? 5 : 1,
                }}
              >
                <Text style={{ fontSize: item.kind === "person" ? 18 : 20 }}>{item.icon}</Text>
                <Text style={{ color: colors.text, fontSize: 12, fontWeight: "700", marginTop: 4 }}>{item.name}</Text>
                <Text style={{ color: "rgba(255,255,255,0.76)", fontSize: 10, marginTop: 2 }}>{item.state}</Text>
              </Pressable>
            );
          })}
        </View>

        <View
          style={{
            marginTop: 12,
            borderRadius: 22,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.09)",
            backgroundColor: "rgba(255,255,255,0.05)",
            padding: 14,
          }}
        >
          <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>선택된 오브젝트</Text>
          <Text style={{ color: "#fff", fontSize: 19, fontWeight: "700", marginTop: 6 }}>{selected.name}</Text>
          <Text style={{ color: "rgba(255,255,255,0.72)", marginTop: 6, lineHeight: 20 }}>{selected.note}</Text>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
            <Pressable style={{ flex: 1, minHeight: 48, borderRadius: 999, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "#07111f", fontWeight: "700" }}>바로 실행</Text>
            </Pressable>
            <Pressable style={{ flex: 1, minHeight: 48, borderRadius: 999, borderWidth: 1, borderColor: "rgba(255,255,255,0.14)", backgroundColor: "rgba(255,255,255,0.04)", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>채팅으로 열기</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
