import { useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";

import { mabiTheme } from "../../lib/ui-theme";
import { useWorldStore } from "../../lib/world-store";

function statSeed(name: string, shift: number) {
  return (name.charCodeAt(0) + name.length * 13 + shift) % 100;
}

function memberStats(name: string, state: string) {
  const care = state.includes("돌봄") ? 88 : 55 + (statSeed(name, 11) % 28);
  const prayer = state.includes("기도") ? 86 : 50 + (statSeed(name, 23) % 32);
  const follow = state.includes("후속") ? 84 : 44 + (statSeed(name, 31) % 36);
  return { care: Math.min(100, care), prayer: Math.min(100, prayer), follow: Math.min(100, follow) };
}

function careTone(state: string) {
  if (state.includes("돌봄") || state.includes("후속")) {
    return { border: "rgba(242,168,168,0.72)", bg: "rgba(242,168,168,0.16)", label: "우선 돌봄" };
  }
  if (state.includes("기도")) {
    return { border: "rgba(143,224,170,0.72)", bg: "rgba(143,224,170,0.16)", label: "기도 진행" };
  }
  return { border: "rgba(120,157,214,0.72)", bg: "rgba(120,157,214,0.16)", label: "일반 관리" };
}

export default function PeopleScreen() {
  const { loading, snapshot, setChatDraft } = useWorldStore();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (loading || !snapshot) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: mabiTheme.background, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: mabiTheme.textPrimary }}>목원 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  const people = snapshot.peopleRecords;
  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return people;
    return people.filter((person) => person.name.includes(q) || person.household.includes(q) || person.state.includes(q));
  }, [people, query]);

  const selected = useMemo(() => {
    if (!filtered.length) return null;
    if (selectedId) {
      return filtered.find((person) => person.id === selectedId) ?? filtered[0];
    }
    return filtered[0];
  }, [filtered, selectedId]);

  const familyMembers = useMemo(() => {
    if (!selected) return [];
    return people.filter((person) => person.household === selected.household);
  }, [people, selected]);

  const urgentCount = people.filter((p) => p.state.includes("후속") || p.state.includes("돌봄")).length;
  const householdCount = new Set(people.map((p) => p.household)).size;
  const cardWidth = Math.floor((width - 32 - 16) / 3);

  const runCommand = (command: string) => {
    setChatDraft(command);
    router.push("/(tabs)/world");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: mabiTheme.background }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 104 }}>
        <Text style={{ color: mabiTheme.textMuted, fontSize: 11, letterSpacing: 1.3 }}>MOKJANG ROSTER</Text>
        <Text style={{ color: mabiTheme.textPrimary, fontSize: 26, fontWeight: "700", marginTop: 4 }}>목원 카드</Text>

        <View style={{ marginTop: 10, borderRadius: 12, borderWidth: 1, borderColor: "rgba(120,157,214,0.35)", backgroundColor: "rgba(20,29,45,0.92)", padding: 10, flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "rgba(243,208,128,0.45)", backgroundColor: "rgba(243,208,128,0.12)", padding: 8 }}>
            <Text style={{ color: "#ffeabf", fontSize: 10 }}>가정 수</Text>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 2 }}>{householdCount}</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "rgba(120,157,214,0.45)", backgroundColor: "rgba(120,157,214,0.12)", padding: 8 }}>
            <Text style={{ color: "#d8e7ff", fontSize: 10 }}>목원 수</Text>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 2 }}>{people.length}</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "rgba(242,168,168,0.45)", backgroundColor: "rgba(242,168,168,0.12)", padding: 8 }}>
            <Text style={{ color: "#ffd7d7", fontSize: 10 }}>우선 돌봄</Text>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 2 }}>{urgentCount}</Text>
          </View>
        </View>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="이름, 가정, 상태 검색"
          placeholderTextColor="rgba(220,232,255,0.46)"
          style={{
            marginTop: 10,
            minHeight: 44,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "rgba(120,157,214,0.4)",
            backgroundColor: "rgba(20,29,45,0.88)",
            color: "#f4f7ff",
            paddingHorizontal: 12,
          }}
        />

        <View style={{ marginTop: 10, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {filtered.map((person) => {
            const active = selected?.id === person.id;
            const tone = careTone(person.state);
            return (
              <Pressable
                key={person.id}
                onPress={() => setSelectedId(person.id)}
                style={{
                  width: cardWidth,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: active ? "rgba(243,208,128,0.7)" : tone.border,
                  backgroundColor: active ? "rgba(243,208,128,0.12)" : "rgba(20,29,45,0.88)",
                  padding: 8,
                  gap: 6,
                }}
              >
                <View style={{ height: 64, borderRadius: 7, backgroundColor: tone.bg, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: "#f4f7ff", fontSize: 10, fontWeight: "700" }}>{person.name.slice(0, 2)}</Text>
                </View>
                <Text numberOfLines={1} style={{ color: "#f4f7ff", fontSize: 11, fontWeight: "700" }}>{person.name}</Text>
                <Text numberOfLines={1} style={{ color: "rgba(216,230,255,0.74)", fontSize: 9 }}>{person.household}</Text>
              </Pressable>
            );
          })}
        </View>

        {selected ? (
          <View style={{ marginTop: 12, borderRadius: 14, borderWidth: 1, borderColor: "rgba(243,208,128,0.55)", backgroundColor: "rgba(11,18,29,0.92)", padding: 12 }}>
            <Text style={{ color: "#ffeabf", fontSize: 11 }}>목원 상태창</Text>
            <View style={{ marginTop: 8, flexDirection: "row", gap: 10 }}>
              <View style={{ width: 128, borderRadius: 12, borderWidth: 1, borderColor: "rgba(120,157,214,0.38)", backgroundColor: "rgba(120,157,214,0.14)", padding: 8, alignItems: "center" }}>
                <View style={{ width: 92, height: 116, borderRadius: 10, backgroundColor: "rgba(15,22,34,0.82)", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: "#f4f7ff", fontSize: 18, fontWeight: "700" }}>{selected.name.slice(0, 2)}</Text>
                </View>
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700", marginTop: 8 }}>{selected.name}</Text>
                <Text style={{ color: "rgba(216,230,255,0.72)", fontSize: 10, marginTop: 2 }}>{selected.household}</Text>
              </View>

              <View style={{ flex: 1, gap: 8 }}>
                <View style={{ borderRadius: 10, borderWidth: 1, borderColor: "rgba(148,171,212,0.35)", backgroundColor: "rgba(255,255,255,0.04)", padding: 8 }}>
                  <Text style={{ color: "rgba(216,230,255,0.78)", fontSize: 10 }}>현재 상태</Text>
                  <Text style={{ color: "#ffffff", fontSize: 13, fontWeight: "700", marginTop: 3 }}>{selected.state}</Text>
                  <Text style={{ color: "rgba(216,230,255,0.72)", fontSize: 11, marginTop: 3 }}>{selected.nextAction}</Text>
                </View>

                <View style={{ borderRadius: 10, borderWidth: 1, borderColor: "rgba(148,171,212,0.35)", backgroundColor: "rgba(255,255,255,0.04)", padding: 8, gap: 6 }}>
                  {[
                    { label: "돌봄", value: memberStats(selected.name, selected.state).care, color: "#f2a8a8" },
                    { label: "기도", value: memberStats(selected.name, selected.state).prayer, color: "#8fe0aa" },
                    { label: "후속", value: memberStats(selected.name, selected.state).follow, color: "#f4d38e" },
                  ].map((row) => (
                    <View key={`${selected.id}-${row.label}`} style={{ gap: 3 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: "rgba(216,230,255,0.8)", fontSize: 10 }}>{row.label}</Text>
                        <Text style={{ color: "rgba(216,230,255,0.8)", fontSize: 10 }}>{row.value}</Text>
                      </View>
                      <View style={{ height: 6, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
                        <View style={{ width: `${row.value}%`, height: "100%", backgroundColor: row.color }} />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View style={{ marginTop: 10, borderRadius: 10, borderWidth: 1, borderColor: "rgba(148,171,212,0.35)", backgroundColor: "rgba(255,255,255,0.04)", padding: 8 }}>
              <Text style={{ color: "#ffeabf", fontSize: 10, fontWeight: "700" }}>가족 관계</Text>
              <Text style={{ color: "rgba(220,232,255,0.66)", fontSize: 10, marginTop: 2 }}>{selected.household} · {familyMembers.length}명</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 7 }}>
                {familyMembers.map((member) => (
                  <View key={`family-${member.id}`} style={{ borderRadius: 999, borderWidth: 1, borderColor: member.id === selected.id ? "rgba(243,208,128,0.7)" : "rgba(120,157,214,0.36)", backgroundColor: member.id === selected.id ? "rgba(243,208,128,0.15)" : "rgba(20,29,45,0.6)", paddingHorizontal: 8, paddingVertical: 4 }}>
                    <Text style={{ color: "#f4f7ff", fontSize: 10 }}>{member.name}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ marginTop: 10, gap: 7 }}>
              <Pressable
                onPress={() => runCommand(`모라, ${selected.name} 중심으로 이번 주 돌봄/기도/심방 실행안 정리해줘`) }
                style={{ minHeight: 42, borderRadius: 10, borderWidth: 1, borderColor: "rgba(243,208,128,0.45)", backgroundColor: "rgba(243,208,128,0.14)", alignItems: "center", justifyContent: "center" }}
              >
                <Text style={{ color: "#ffeabf", fontWeight: "700" }}>모라에게 실행안 요청</Text>
              </Pressable>
              <Pressable
                onPress={() => runCommand(`모라, ${selected.household} 가정 전체 상태를 업데이트하고 오늘 우선순위만 보여줘`) }
                style={{ minHeight: 42, borderRadius: 10, borderWidth: 1, borderColor: "rgba(120,157,214,0.45)", backgroundColor: "rgba(120,157,214,0.14)", alignItems: "center", justifyContent: "center" }}
              >
                <Text style={{ color: "#d8e7ff", fontWeight: "700" }}>가정 단위로 정리 요청</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
