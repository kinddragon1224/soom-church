import { useState } from "react";
import { Alert, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { deleteMember, updateMember } from "../lib/member-manage-source";
import { getMemberLocalCache, setMemberLocalCache, withMemberOverride, withRemovedMember } from "../lib/member-local-cache";

function statSeed(name: string, shift: number) {
  return (name.charCodeAt(0) + name.length * 13 + shift) % 100;
}

function memberStats(name: string, state: string) {
  const care = state.includes("돌봄") ? 88 : 55 + (statSeed(name, 11) % 28);
  const prayer = state.includes("기도") ? 86 : 50 + (statSeed(name, 23) % 32);
  const follow = state.includes("후속") ? 84 : 44 + (statSeed(name, 31) % 36);
  return { care: Math.min(100, care), prayer: Math.min(100, prayer), follow: Math.min(100, follow) };
}

export default function MemberDetailScreen() {
  const params = useLocalSearchParams<{ id?: string; name?: string; household?: string; state?: string; nextAction?: string }>();

  const [name, setName] = useState(params.name ?? "");
  const [household, setHousehold] = useState(params.household ?? "");
  const [state, setState] = useState(params.state ?? "");
  const [nextAction, setNextAction] = useState(params.nextAction ?? "");
  const [saving, setSaving] = useState(false);

  const id = typeof params.id === "string" ? params.id : "";

  const save = async () => {
    if (!id || !name.trim() || saving) return;
    setSaving(true);
    try {
      await updateMember({ id, name: name.trim(), household: household.trim(), state: state.trim(), nextAction: nextAction.trim() });
      const cache = await getMemberLocalCache();
      const nextCache = withMemberOverride(cache, id, {
        name: name.trim(),
        household: household.trim() || "가정 미지정",
        state: state.trim() || "등록",
        nextAction: nextAction.trim() || "다음 액션 미정",
      });
      await setMemberLocalCache(nextCache);
      Alert.alert("완료", "수정했어.", [{ text: "확인", onPress: () => router.back() }]);
    } catch {
      const cache = await getMemberLocalCache();
      const nextCache = withMemberOverride(cache, id, {
        name: name.trim(),
        household: household.trim() || "가정 미지정",
        state: state.trim() || "등록",
        nextAction: nextAction.trim() || "다음 액션 미정",
      });
      await setMemberLocalCache(nextCache);
      Alert.alert("완료", "서버는 실패했지만 화면 기준으로 수정 반영했어.", [{ text: "확인", onPress: () => router.back() }]);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!id || !name.trim() || saving) return;
    Alert.alert("목원 삭제", `${name}을(를) 삭제할까?`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          setSaving(true);
          try {
            await deleteMember({ id, name });
          } catch {
            // ignore and apply local cache anyway
          }

          const cache = await getMemberLocalCache();
          const nextCache = withRemovedMember(cache, { id, name });
          await setMemberLocalCache(nextCache);
          setSaving(false);
          Alert.alert("완료", "삭제했어.", [{ text: "확인", onPress: () => router.back() }]);
        },
      },
    ]);
  };

  const stats = memberStats(name, state);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121621" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 32 }}>
        <Pressable onPress={() => router.back()} style={{ alignSelf: "flex-start", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: "#3a435f", backgroundColor: "#182038" }}>
          <Text style={{ color: "#d8e7ff", fontSize: 11 }}>← 카드 목록</Text>
        </Pressable>

        <View style={{ marginTop: 10, borderRadius: 14, borderWidth: 1, borderColor: "#3a435f", backgroundColor: "#121621", padding: 12 }}>
          <Text style={{ color: "#d8e7ff", fontSize: 11 }}>목원 상세</Text>
          <View style={{ marginTop: 8, flexDirection: "row", gap: 10 }}>
            <View style={{ width: 132, borderRadius: 12, borderWidth: 1, borderColor: "rgba(120,157,214,0.38)", backgroundColor: "rgba(120,157,214,0.14)", padding: 8, alignItems: "center" }}>
              <View style={{ width: 96, height: 118, borderRadius: 8, backgroundColor: "#0f1a31", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#f5f5f5", fontSize: 18, fontWeight: "700" }}>{name.slice(0, 2)}</Text>
              </View>
            </View>

            <View style={{ flex: 1, gap: 8 }}>
              {[{ label: "돌봄", value: stats.care, color: "#f2a8a8" }, { label: "기도", value: stats.prayer, color: "#8fe0aa" }, { label: "후속", value: stats.follow, color: "#f4d38e" }].map((row) => (
                <View key={row.label} style={{ gap: 3 }}>
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

        <View style={{ marginTop: 10, borderRadius: 12, borderWidth: 1, borderColor: "#3a3a3a", backgroundColor: "#121212", padding: 10, gap: 8 }}>
          <TextInput value={name} onChangeText={setName} placeholder="이름" placeholderTextColor="rgba(245,245,245,0.45)" style={{ minHeight: 40, borderRadius: 10, borderWidth: 1, borderColor: "#343434", backgroundColor: "#181818", color: "#f5f5f5", paddingHorizontal: 10 }} />
          <TextInput value={household} onChangeText={setHousehold} placeholder="가정" placeholderTextColor="rgba(245,245,245,0.45)" style={{ minHeight: 40, borderRadius: 10, borderWidth: 1, borderColor: "#343434", backgroundColor: "#181818", color: "#f5f5f5", paddingHorizontal: 10 }} />
          <TextInput value={state} onChangeText={setState} placeholder="상태" placeholderTextColor="rgba(245,245,245,0.45)" style={{ minHeight: 40, borderRadius: 10, borderWidth: 1, borderColor: "#343434", backgroundColor: "#181818", color: "#f5f5f5", paddingHorizontal: 10 }} />
          <TextInput value={nextAction} onChangeText={setNextAction} placeholder="다음 액션" placeholderTextColor="rgba(245,245,245,0.45)" style={{ minHeight: 40, borderRadius: 10, borderWidth: 1, borderColor: "#343434", backgroundColor: "#181818", color: "#f5f5f5", paddingHorizontal: 10 }} />

          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable onPress={save} disabled={saving || !name.trim()} style={{ flex: 1, minHeight: 42, borderRadius: 10, borderWidth: 1, borderColor: "#5aa36f", backgroundColor: "#152419", alignItems: "center", justifyContent: "center", opacity: saving || !name.trim() ? 0.55 : 1 }}>
              <Text style={{ color: "#d7ffe3", fontWeight: "700" }}>{saving ? "저장 중..." : "저장"}</Text>
            </Pressable>
            <Pressable onPress={remove} disabled={saving} style={{ flex: 1, minHeight: 42, borderRadius: 10, borderWidth: 1, borderColor: "#c95c5c", backgroundColor: "#2a1515", alignItems: "center", justifyContent: "center", opacity: saving ? 0.55 : 1 }}>
              <Text style={{ color: "#f1c2c2", fontWeight: "700" }}>삭제</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
