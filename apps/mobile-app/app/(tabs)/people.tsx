import { useCallback, useMemo, useState } from "react";
import { Alert, Image, Pressable, SafeAreaView, ScrollView, Text, TextInput, View, useWindowDimensions } from "react-native";
import { router, useFocusEffect } from "expo-router";

import { createMember } from "../../lib/member-manage-source";
import { applyMemberLocalCache, getMemberLocalCache, setMemberLocalCache, withAddedMember, type LocalMember, type MemberLocalCache } from "../../lib/member-local-cache";
import { useWorldStore } from "../../lib/world-store";

type MemberFilter = "전체" | "긴급" | "결석" | "기도" | "관심";

function statusStars(state: string) {
  if (state.includes("긴급") || state.includes("돌봄") || state.includes("후속")) return 4;
  if (state.includes("기도") || state.includes("관심")) return 3;
  if (state.includes("결석")) return 2;
  return 2;
}

function includesState(state: string, keyword: string) {
  return state === keyword || state.includes(keyword);
}

function getStatusTone(state: string) {
  if (state.includes("긴급")) {
    return {
      borderColor: "#b84f4f",
      backgroundColor: "#4a1f22",
      badgeBorder: "#d36a6a",
      badgeBackground: "rgba(179,72,72,0.22)",
      badgeText: "#ffd7d7",
      accent: "#ffb1b1",
    };
  }
  if (state.includes("결석")) {
    return {
      borderColor: "#8b6840",
      backgroundColor: "#3e2c1d",
      badgeBorder: "#b88b57",
      badgeBackground: "rgba(176,128,68,0.2)",
      badgeText: "#f6ddb6",
      accent: "#f2c98d",
    };
  }
  if (state.includes("기도")) {
    return {
      borderColor: "#3f7f67",
      backgroundColor: "#183228",
      badgeBorder: "#58a685",
      badgeBackground: "rgba(71,147,113,0.2)",
      badgeText: "#d3ffe9",
      accent: "#9ee4c2",
    };
  }
  if (state.includes("관심")) {
    return {
      borderColor: "#456d9f",
      backgroundColor: "#1c2b43",
      badgeBorder: "#5f8fcb",
      badgeBackground: "rgba(83,121,189,0.2)",
      badgeText: "#d9e8ff",
      accent: "#9bc0ff",
    };
  }
  return {
    borderColor: "#6f2f2f",
    backgroundColor: "#5a1f1f",
    badgeBorder: "#7c5a2b",
    badgeBackground: "rgba(124,90,43,0.18)",
    badgeText: "#f1ddb0",
    accent: "#f7e0aa",
  };
}

function getPriority(state: string) {
  if (state.includes("긴급")) return 0;
  if (state.includes("결석")) return 1;
  if (state.includes("관심")) return 2;
  if (state.includes("기도")) return 3;
  return 4;
}

function getShortNextAction(member: LocalMember) {
  const candidates = [member.nextAction, member.followUpMemo, member.careMemo, member.prayerRequest]
    .map((item) => item?.trim())
    .filter((item): item is string => Boolean(item));

  const picked = candidates[0];
  if (!picked || picked === "다음 액션 미정" || picked === "동기화 대기" || picked === "다시 저장 시도") return null;
  return picked.length > 22 ? `${picked.slice(0, 22)}…` : picked;
}

export default function PeopleScreen() {
  const { snapshot, refresh } = useWorldStore();
  const { width } = useWindowDimensions();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<MemberFilter>("전체");
  const [cache, setCache] = useState<MemberLocalCache>({ added: [], removedNames: [], overrides: {}, meetingRecords: [] });

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newHousehold, setNewHousehold] = useState("");

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      void refresh();
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

  const summary = useMemo(() => {
    const urgent = members.filter((member) => includesState(member.state, "긴급") || member.state === "긴급돌봄").length;
    const absent = members.filter((member) => includesState(member.state, "결석")).length;
    const prayer = members.filter((member) => includesState(member.state, "기도")).length;
    const interest = members.filter((member) => includesState(member.state, "관심")).length;

    return {
      total: members.length,
      urgent,
      absent,
      prayer,
      interest,
      text: `전체 ${members.length}명 · 긴급 ${urgent} · 결석 ${absent} · 기도 ${prayer} · 관심 ${interest}`,
    };
  }, [members]);

  const sortedMembers = useMemo(
    () => members.map((member, index) => ({ member, index })).sort((a, b) => {
      const diff = getPriority(a.member.state) - getPriority(b.member.state);
      if (diff !== 0) return diff;
      return a.index - b.index;
    }).map(({ member }) => member),
    [members]
  );

  const filteredMembers = useMemo(() => {
    if (filter === "전체") return sortedMembers;
    const keyword = filter;
    return sortedMembers.filter((member) => member.state.includes(keyword));
  }, [filter, sortedMembers]);

  const columns = width >= 390 ? 3 : 2;
  const cardWidth = Math.floor((width - 32 - (columns - 1) * 8) / columns);
  const cardsPerPage = columns * 5;
  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / cardsPerPage));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const paged = filteredMembers.slice(startIndex, startIndex + cardsPerPage);

  const setFilterAndReset = (nextFilter: MemberFilter) => {
    setFilter(nextFilter);
    setPage(1);
  };

  const addMember = async () => {
    if (!newName.trim() || adding) return;

    setAdding(true);
    const name = newName.trim();
    const household = newHousehold.trim() || "가정 미지정";
    const tempId = `local-pending-${Date.now()}`;
    const tempMember: LocalMember = { id: tempId, name, household, state: "등록(동기화중)", nextAction: "동기화 대기" };
    const optimisticCache = withAddedMember(cache, tempMember);

    setCache(optimisticCache);
    await setMemberLocalCache(optimisticCache);
    setSelectedId(tempId);
    setPage(1);
    setFilter("전체");
    setNewName("");
    setNewHousehold("");

    try {
      const result = await Promise.race([
        createMember({
          name,
          household,
          state: "등록",
          nextAction: "다음 액션 미정",
        }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("request-timeout")), 13000)),
      ]);

      const id = typeof (result as { id?: unknown })?.id === "string" ? `p-${(result as { id: string }).id}` : tempId;
      const syncedMember: LocalMember = { id, name, household, state: "등록", nextAction: "다음 액션 미정" };
      const syncedCache: MemberLocalCache = {
        ...optimisticCache,
        added: [syncedMember, ...optimisticCache.added.filter((item) => item.id !== tempId && item.id !== id)],
      };
      setCache(syncedCache);
      await setMemberLocalCache(syncedCache);
      void refresh();
      setSelectedId(id);
    } catch (error) {
      const reason = error instanceof Error ? error.message : "";
      if (reason.includes("ACCOUNT_LOGIN_REQUIRED") || reason.includes("account login required") || reason.includes("401")) {
        const rollbackCache: MemberLocalCache = {
          ...optimisticCache,
          added: optimisticCache.added.filter((item) => item.id !== tempId),
        };
        setCache(rollbackCache);
        await setMemberLocalCache(rollbackCache);
        Alert.alert("로그인 필요", "로그인 연결이 풀렸어. 다시 로그인해줘.");
        router.replace("/login");
      } else {
        const pendingCache: MemberLocalCache = {
          ...optimisticCache,
          added: optimisticCache.added.map((item) => (item.id === tempId ? { ...item, state: "등록(동기화실패)", nextAction: "다시 저장 시도" } : item)),
        };
        setCache(pendingCache);
        await setMemberLocalCache(pendingCache);
        Alert.alert("동기화 대기", reason ? `일단 카드에 추가했고 서버 저장은 실패: ${reason}` : "일단 카드에 추가했고 서버 저장은 실패했어.");
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 104 }}>
        <Text style={{ color: "rgba(230,230,230,0.56)", fontSize: 11, letterSpacing: 1.3 }}>ROSTER GRID</Text>
        <Text style={{ color: "#f5f5f5", fontSize: 26, fontWeight: "700", marginTop: 4 }}>목원 카드</Text>
        <Text style={{ color: "rgba(245,245,245,0.72)", fontSize: 12, marginTop: 6 }}>이번 주 돌봄이 필요한 목원을 먼저 보여줍니다.</Text>

        <View style={{ marginTop: 12, borderRadius: 12, borderWidth: 1, borderColor: "#2f2f2f", backgroundColor: "#141414", padding: 12, gap: 8 }}>
          <Text style={{ color: "#f1ddb0", fontSize: 12, fontWeight: "700" }}>{summary.text}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {(["전체", "긴급", "결석", "기도", "관심"] as MemberFilter[]).map((item) => {
              const active = filter === item;
              return (
                <Pressable
                  key={item}
                  onPress={() => setFilterAndReset(item)}
                  style={{
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: active ? "#f1ddb0" : "#3b3b3b",
                    backgroundColor: active ? "#3a2b17" : "#181818",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                  }}
                >
                  <Text style={{ color: active ? "#fff0c7" : "rgba(245,245,245,0.72)", fontSize: 11, fontWeight: "700" }}>{item}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ marginTop: 10, borderRadius: 12, borderWidth: 1, borderColor: "#2f2f2f", backgroundColor: "#141414", padding: 10, gap: 8 }}>
          <Text style={{ color: "rgba(245,245,245,0.72)", fontSize: 11 }}>이름만 입력해도 먼저 추가할 수 있습니다. 자세한 기록은 카드에서 이어서 남기세요.</Text>
          <TextInput value={newName} onChangeText={setNewName} placeholder="이름만 입력해도 추가" placeholderTextColor="rgba(245,245,245,0.45)" style={{ minHeight: 40, borderRadius: 10, borderWidth: 1, borderColor: "#343434", backgroundColor: "#181818", color: "#f5f5f5", paddingHorizontal: 10 }} />
          <TextInput value={newHousehold} onChangeText={setNewHousehold} placeholder="가정(선택)" placeholderTextColor="rgba(245,245,245,0.45)" style={{ minHeight: 40, borderRadius: 10, borderWidth: 1, borderColor: "#343434", backgroundColor: "#181818", color: "#f5f5f5", paddingHorizontal: 10 }} />
          <Pressable onPress={addMember} disabled={adding || !newName.trim()} style={{ minHeight: 40, borderRadius: 10, borderWidth: 1, borderColor: "#5aa36f", backgroundColor: "#152419", alignItems: "center", justifyContent: "center", opacity: adding || !newName.trim() ? 0.55 : 1 }}>
            <Text style={{ color: "#d7ffe3", fontWeight: "700" }}>{adding ? "추가 중..." : "목원 추가"}</Text>
          </Pressable>
        </View>

        {members.length === 0 ? (
          <View style={{ marginTop: 14, borderRadius: 12, borderWidth: 1, borderColor: "#2f2f2f", backgroundColor: "#141414", padding: 18 }}>
            <Text style={{ color: "rgba(245,245,245,0.75)", fontSize: 13 }}>아직 목원이 없습니다. 이름만 입력해서 첫 목원을 추가해보세요.</Text>
          </View>
        ) : filteredMembers.length === 0 ? (
          <View style={{ marginTop: 14, borderRadius: 12, borderWidth: 1, borderColor: "#2f2f2f", backgroundColor: "#141414", padding: 18 }}>
            <Text style={{ color: "rgba(245,245,245,0.75)", fontSize: 13 }}>이 상태의 목원은 없습니다.</Text>
          </View>
        ) : (
          <View style={{ marginTop: 10, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {paged.map((member) => {
              const tone = getStatusTone(member.state);
              const nextAction = getShortNextAction(member);
              const isSelected = selectedId === member.id;
              return (
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
                        avatarUrl: member.avatarUrl,
                        prayerRequest: member.prayerRequest,
                        careMemo: member.careMemo,
                        followUpMemo: member.followUpMemo,
                      },
                    });
                  }}
                  style={{
                    width: cardWidth,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: isSelected ? "#ffd27d" : tone.borderColor,
                    backgroundColor: isSelected ? "#4d2d22" : tone.backgroundColor,
                    padding: 8,
                    gap: 6,
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                    <Text style={{ color: tone.accent, fontSize: 9, fontWeight: "700" }}>Lv.1</Text>
                    <View style={{ borderRadius: 999, borderWidth: 1, borderColor: tone.badgeBorder, backgroundColor: tone.badgeBackground, paddingHorizontal: 7, paddingVertical: 3, maxWidth: cardWidth * 0.56 }}>
                      <Text numberOfLines={1} style={{ color: tone.badgeText, fontSize: 9, fontWeight: "700" }}>{member.state || "안정"}</Text>
                    </View>
                  </View>

                  <View style={{ height: 72, borderRadius: 8, backgroundColor: "rgba(0,0,0,0.2)", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {member.avatarUrl ? (
                      <Image source={{ uri: member.avatarUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                    ) : (
                      <View style={{ width: 42, height: 42, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: "#f5f5f5", fontSize: 14, fontWeight: "700" }}>{member.name.slice(0, 2)}</Text>
                      </View>
                    )}
                  </View>

                  <View style={{ gap: 3 }}>
                    <Text numberOfLines={1} style={{ color: "#f5f5f5", fontSize: 13, fontWeight: "700" }}>{member.name}</Text>
                    <Text numberOfLines={1} style={{ color: "rgba(245,245,245,0.58)", fontSize: 10 }}>{member.household || "가정 미지정"}</Text>
                  </View>

                  <View style={{ flexDirection: "row", gap: 1 }}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Text key={`${member.id}-s-${idx}`} style={{ color: idx < statusStars(member.state) ? "#ffd24a" : "#7c5a2b", fontSize: 9 }}>★</Text>
                    ))}
                  </View>

                  {nextAction ? (
                    <View style={{ borderRadius: 8, backgroundColor: "rgba(0,0,0,0.14)", paddingHorizontal: 7, paddingVertical: 6 }}>
                      <Text numberOfLines={1} style={{ color: "rgba(245,245,245,0.8)", fontSize: 10 }}>다음: {nextAction}</Text>
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={{ marginTop: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ color: "rgba(245,245,245,0.6)", fontSize: 10 }}>{filteredMembers.length}명 · {currentPage}/{totalPages}페이지</Text>
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
