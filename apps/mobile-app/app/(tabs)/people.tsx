import { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, SafeAreaView, ScrollView, Text, TextInput, View, useWindowDimensions } from "react-native";
import { router, useFocusEffect } from "expo-router";

import { createMember } from "../../lib/member-manage-source";
import { applyMemberLocalCache, getMemberLocalCache, setMemberLocalCache, withAddedMember, type LocalMember, type MemberLocalCache } from "../../lib/member-local-cache";
import { useWorldStore } from "../../lib/world-store";

function statusStars(state: string) {
  if (state.includes("돌봄") || state.includes("후속")) return 4;
  if (state.includes("기도")) return 3;
  return 2;
}

export default function PeopleScreen() {
  const { loading, snapshot, refresh } = useWorldStore();
  const { width } = useWindowDimensions();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [cache, setCache] = useState<MemberLocalCache>({ added: [], removedNames: [], overrides: {} });

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newHousehold, setNewHousehold] = useState("");

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      getMemberLocalCache().then((loaded) => {
        if (mounted) setCache(loaded);
      });
      return () => {
        mounted = false;
      };
    }, [])
  );

  const remoteMembers: LocalMember[] = useMemo(
    () =>
      (snapshot?.peopleRecords ?? []).map((person) => ({
        id: person.id,
        name: person.name,
        household: person.household,
        state: person.state,
        nextAction: person.nextAction,
      })),
    [snapshot?.peopleRecords]
  );

  const members = useMemo(() => applyMemberLocalCache(remoteMembers, cache), [remoteMembers, cache]);

  const columns = width >= 390 ? 4 : 3;
  const cardWidth = Math.floor((width - 32 - (columns - 1) * 8) / columns);
  const cardsPerPage = columns * 5;
  const totalPages = Math.max(1, Math.ceil(members.length / cardsPerPage));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const paged = members.slice(startIndex, startIndex + cardsPerPage);

  if (loading || !snapshot) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f0f", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#f5f5f5" }}>목원 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  const addMember = async () => {
    if (!newName.trim() || adding) return;

    setAdding(true);
    const name = newName.trim();
    const household = newHousehold.trim() || "가정 미지정";

    try {
      const result = await createMember({
        name,
        household,
        state: "등록",
        nextAction: "다음 액션 미정",
      });

      const id = typeof (result as { id?: unknown })?.id === "string" ? `p-${(result as { id: string }).id}` : `local-${Date.now()}`;
      const member: LocalMember = { id, name, household, state: "등록", nextAction: "다음 액션 미정" };
      const nextCache = withAddedMember(cache, member);
      setCache(nextCache);
      await setMemberLocalCache(nextCache);
      await refresh();
      setSelectedId(member.id);
      setPage(1);
      setNewName("");
      setNewHousehold("");
      Alert.alert("완료", "목원을 추가했어.");
    } catch {
      const member: LocalMember = { id: `local-${Date.now()}`, name, household, state: "등록", nextAction: "다음 액션 미정" };
      const nextCache = withAddedMember(cache, member);
      setCache(nextCache);
      await setMemberLocalCache(nextCache);
      setSelectedId(member.id);
      setPage(1);
      setNewName("");
      setNewHousehold("");
      Alert.alert("임시 추가", "서버 저장은 실패했지만 화면에 바로 추가했어.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 104 }}>
        <Text style={{ color: "rgba(230,230,230,0.56)", fontSize: 11, letterSpacing: 1.3 }}>ROSTER GRID</Text>
        <Text style={{ color: "#f5f5f5", fontSize: 26, fontWeight: "700", marginTop: 4 }}>목원 카드</Text>

        <View style={{ marginTop: 10, borderRadius: 12, borderWidth: 1, borderColor: "#2f2f2f", backgroundColor: "#141414", padding: 10, gap: 8 }}>
          <TextInput value={newName} onChangeText={setNewName} placeholder="이름만 입력해도 추가" placeholderTextColor="rgba(245,245,245,0.45)" style={{ minHeight: 40, borderRadius: 10, borderWidth: 1, borderColor: "#343434", backgroundColor: "#181818", color: "#f5f5f5", paddingHorizontal: 10 }} />
          <TextInput value={newHousehold} onChangeText={setNewHousehold} placeholder="가정(선택)" placeholderTextColor="rgba(245,245,245,0.45)" style={{ minHeight: 40, borderRadius: 10, borderWidth: 1, borderColor: "#343434", backgroundColor: "#181818", color: "#f5f5f5", paddingHorizontal: 10 }} />
          <Pressable onPress={addMember} disabled={adding || !newName.trim()} style={{ minHeight: 40, borderRadius: 10, borderWidth: 1, borderColor: "#5aa36f", backgroundColor: "#152419", alignItems: "center", justifyContent: "center", opacity: adding || !newName.trim() ? 0.55 : 1 }}>
            <Text style={{ color: "#d7ffe3", fontWeight: "700" }}>{adding ? "추가 중..." : "목원 추가"}</Text>
          </Pressable>
        </View>

        <View style={{ marginTop: 10, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {paged.map((member) => (
            <Pressable
              key={member.id}
              onPress={() => {
                setSelectedId(member.id);
                router.push({
                  pathname: "/member-detail",
                  params: {
                    id: member.id,
                    name: member.name,
                    household: member.household,
                    state: member.state,
                    nextAction: member.nextAction,
                  },
                });
              }}
              style={{
                width: cardWidth,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: selectedId === member.id ? "#ffd27d" : "#6f2f2f",
                backgroundColor: selectedId === member.id ? "#732626" : "#5a1f1f",
                padding: 6,
                gap: 4,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ color: "#f7e0aa", fontSize: 9, fontWeight: "700" }}>Lv.1</Text>
                <Text style={{ color: "#d7d7d7", fontSize: 8 }}>{member.state}</Text>
              </View>
              <View style={{ height: 60, borderRadius: 6, backgroundColor: "#2a1515", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#f5f5f5", fontSize: 11, fontWeight: "700" }}>{member.name.slice(0, 2)}</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 1 }}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Text key={`${member.id}-s-${idx}`} style={{ color: idx < statusStars(member.state) ? "#ffd24a" : "#7c5a2b", fontSize: 9 }}>★</Text>
                ))}
              </View>
            </Pressable>
          ))}
        </View>

        <View style={{ marginTop: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ color: "rgba(245,245,245,0.6)", fontSize: 10 }}>{members.length}명 · {currentPage}/{totalPages}페이지</Text>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Pressable onPress={() => setPage((prev) => Math.max(1, prev - 1))} disabled={currentPage <= 1} style={{ borderRadius: 8, borderWidth: 1, borderColor: "#343434", backgroundColor: "#141414", paddingHorizontal: 8, paddingVertical: 4, opacity: currentPage <= 1 ? 0.45 : 1 }}>
              <Text style={{ color: "#d7d7d7", fontSize: 10 }}>이전</Text>
            </Pressable>
            <Pressable onPress={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage >= totalPages} style={{ borderRadius: 8, borderWidth: 1, borderColor: "#343434", backgroundColor: "#141414", paddingHorizontal: 8, paddingVertical: 4, opacity: currentPage >= totalPages ? 0.45 : 1 }}>
              <Text style={{ color: "#d7d7d7", fontSize: 10 }}>다음</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
