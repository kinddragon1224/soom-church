import { useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
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

export default function PeopleScreen() {
  const { loading, snapshot, setChatDraft } = useWorldStore();
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

  const urgentCount = people.filter((p) => p.state.includes("후속") || p.state.includes("돌봄")).length;
  const settledCount = people.filter((p) => p.state.includes("안정") || p.state.includes("기도")).length;

  const runCommand = (command: string) => {
    setChatDraft(command);
    router.push("/(tabs)/world");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: mabiTheme.background }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 100 }}>
        <Text style={{ color: mabiTheme.textMuted, fontSize: 11, letterSpacing: 1.5 }}>MEMBERS CARE</Text>
        <Text style={{ color: mabiTheme.textPrimary, fontSize: 28, fontWeight: "700", marginTop: 4 }}>목원 관리</Text>

        <View style={{ marginTop: 10, borderRadius: 12, borderWidth: 1, borderColor: "rgba(120,157,214,0.35)", backgroundColor: "rgba(20,29,45,0.92)", padding: 10, flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "rgba(242,168,168,0.45)", backgroundColor: "rgba(242,168,168,0.12)", padding: 8 }}>
            <Text style={{ color: "#ffd7d7", fontSize: 10 }}>긴급 관리</Text>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 2 }}>{urgentCount}</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "rgba(143,224,170,0.45)", backgroundColor: "rgba(143,224,170,0.12)", padding: 8 }}>
            <Text style={{ color: "#d7ffe3", fontSize: 10 }}>안정/기도</Text>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 2 }}>{settledCount}</Text>
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

        <View style={{ marginTop: 10, gap: 8 }}>
          {filtered.map((person) => {
            const active = selected?.id === person.id;
            return (
              <Pressable
                key={person.id}
                onPress={() => setSelectedId(person.id)}
                style={{
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: active ? "rgba(243,208,128,0.68)" : "rgba(120,157,214,0.3)",
                  backgroundColor: active ? "rgba(243,208,128,0.12)" : "rgba(20,29,45,0.88)",
                  padding: 10,
                  gap: 5,
                }}
              >
                <Text style={{ color: "#f4f7ff", fontSize: 13, fontWeight: "700" }}>{person.name} · {person.household}</Text>
                <Text style={{ color: "rgba(216,230,255,0.76)", fontSize: 11 }}>{person.state} · {person.nextAction}</Text>
              </Pressable>
            );
          })}
        </View>

        {selected ? (
          <View style={{ marginTop: 12, borderRadius: 14, borderWidth: 1, borderColor: "rgba(243,208,128,0.55)", backgroundColor: "rgba(11,18,29,0.92)", padding: 12 }}>
            <Text style={{ color: "#ffeabf", fontSize: 11 }}>선택 목원</Text>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 4 }}>{selected.name}</Text>
            <Text style={{ color: "rgba(216,230,255,0.74)", marginTop: 4 }}>{selected.household} · {selected.state}</Text>

            <View style={{ marginTop: 10, gap: 6 }}>
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
                  <View style={{ height: 7, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
                    <View style={{ width: `${row.value}%`, height: "100%", backgroundColor: row.color }} />
                  </View>
                </View>
              ))}
            </View>

            <View style={{ marginTop: 10, gap: 7 }}>
              <Pressable
                onPress={() => runCommand(`모라, ${selected.name} 후속 연락 오늘 바로 실행`) }
                style={{ minHeight: 42, borderRadius: 10, borderWidth: 1, borderColor: "rgba(242,168,168,0.45)", backgroundColor: "rgba(242,168,168,0.14)", alignItems: "center", justifyContent: "center" }}
              >
                <Text style={{ color: "#ffd7d7", fontWeight: "700" }}>후속 명령 보내기</Text>
              </Pressable>
              <Pressable
                onPress={() => runCommand(`모라, ${selected.name} 기도 요청과 응답 상태 업데이트`) }
                style={{ minHeight: 42, borderRadius: 10, borderWidth: 1, borderColor: "rgba(143,224,170,0.45)", backgroundColor: "rgba(143,224,170,0.14)", alignItems: "center", justifyContent: "center" }}
              >
                <Text style={{ color: "#d7ffe3", fontWeight: "700" }}>기도 명령 보내기</Text>
              </Pressable>
              <Pressable
                onPress={() => runCommand(`모라, ${selected.name} 중심 오늘 목양 실행안 3개 제안`) }
                style={{ minHeight: 42, borderRadius: 10, borderWidth: 1, borderColor: "rgba(243,208,128,0.45)", backgroundColor: "rgba(243,208,128,0.14)", alignItems: "center", justifyContent: "center" }}
              >
                <Text style={{ color: "#ffeabf", fontWeight: "700" }}>오늘 실행안 명령 보내기</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
