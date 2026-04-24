import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Image, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { deleteMember, updateMember } from "../lib/member-manage-source";
import { getMemberLocalCache, setMemberLocalCache, withMemberOverride, withRemovedMember } from "../lib/member-local-cache";
import { uploadMemberImageFromUri } from "../lib/member-image-upload-source";

function statSeed(name: string, shift: number) {
  return (name.charCodeAt(0) + name.length * 13 + shift) % 100;
}

function memberStats(name: string, state: string) {
  const care = state.includes("돌봄") ? 88 : 55 + (statSeed(name, 11) % 28);
  const prayer = state.includes("기도") ? 86 : 50 + (statSeed(name, 23) % 32);
  const follow = state.includes("후속") ? 84 : 44 + (statSeed(name, 31) % 36);
  return { care: Math.min(100, care), prayer: Math.min(100, prayer), follow: Math.min(100, follow) };
}

const STATUS_OPTIONS = ["안정", "관심", "결석", "기도", "긴급돌봄"] as const;

export default function MemberDetailScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    household?: string;
    state?: string;
    nextAction?: string;
    avatarUrl?: string;
    prayerRequest?: string;
    careMemo?: string;
    followUpMemo?: string;
  }>();

  const [name, setName] = useState(params.name ?? "");
  const [household, setHousehold] = useState(params.household ?? "");
  const [state, setState] = useState(params.state ?? "");
  const [nextAction, setNextAction] = useState(params.nextAction ?? "");
  const [avatarUrl, setAvatarUrl] = useState(params.avatarUrl ?? "");
  const [prayerRequest, setPrayerRequest] = useState(params.prayerRequest ?? "");
  const [careMemo, setCareMemo] = useState(params.careMemo ?? "");
  const [followUpMemo, setFollowUpMemo] = useState(params.followUpMemo ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const id = typeof params.id === "string" ? params.id : "";

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const hydrate = async () => {
      if (!id) return;
      const cache = await getMemberLocalCache();
      const override = cache.overrides[id];
      const added = cache.added.find((item) => item.id === id);
      const source = override ?? added;
      if (!source) return;

      if (typeof source.name === "string") setName(source.name);
      if (typeof source.household === "string") setHousehold(source.household);
      if (typeof source.state === "string") setState(source.state);
      if (typeof source.nextAction === "string") setNextAction(source.nextAction);
      if (typeof source.avatarUrl === "string") setAvatarUrl(source.avatarUrl);
      if (typeof source.prayerRequest === "string") setPrayerRequest(source.prayerRequest);
      if (typeof source.careMemo === "string") setCareMemo(source.careMemo);
      if (typeof source.followUpMemo === "string") setFollowUpMemo(source.followUpMemo);
    };
    void hydrate();
  }, [id]);

  const saveLocalOverride = async (next: {
    name: string;
    household: string;
    state: string;
    nextAction: string;
    avatarUrl?: string;
    prayerRequest?: string;
    careMemo?: string;
    followUpMemo?: string;
  }) => {
    if (!id) return;
    const cache = await getMemberLocalCache();
    const nextCache = withMemberOverride(cache, id, next);
    await setMemberLocalCache(nextCache);
  };

  const showSavedFeedback = () => {
    setSavedFeedback(true);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => {
      setSavedFeedback(false);
    }, 1400);
  };

  const pickImage = async () => {
    if (!id || uploading || saving) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("권한 필요", "사진 선택 권한이 필요해.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.85,
    });

    if (result.canceled || !result.assets?.length) return;

    const pickedUri = result.assets[0].uri;
    setUploading(true);

    try {
      const uploadedUrl = await uploadMemberImageFromUri(pickedUri);
      setAvatarUrl(uploadedUrl);
      await saveLocalOverride({
        name: name.trim() || "이름 미입력",
        household: household.trim() || "가정 미지정",
        state: state.trim() || "등록",
        nextAction: nextAction.trim() || "다음 액션 미정",
        avatarUrl: uploadedUrl,
        prayerRequest: prayerRequest.trim(),
        careMemo: careMemo.trim(),
        followUpMemo: followUpMemo.trim(),
      });
      Alert.alert("완료", "사진 업로드했어.");
    } catch {
      setAvatarUrl(pickedUri);
      await saveLocalOverride({
        name: name.trim() || "이름 미입력",
        household: household.trim() || "가정 미지정",
        state: state.trim() || "등록",
        nextAction: nextAction.trim() || "다음 액션 미정",
        avatarUrl: pickedUri,
        prayerRequest: prayerRequest.trim(),
        careMemo: careMemo.trim(),
        followUpMemo: followUpMemo.trim(),
      });
      Alert.alert("임시 저장", "서버 업로드는 실패했지만 기기에서는 저장했어.");
    } finally {
      setUploading(false);
    }
  };

  const clearImage = async () => {
    if (!id || uploading || saving) return;
    setAvatarUrl("");
    await saveLocalOverride({
      name: name.trim() || "이름 미입력",
      household: household.trim() || "가정 미지정",
      state: state.trim() || "등록",
      nextAction: nextAction.trim() || "다음 액션 미정",
      avatarUrl: "",
      prayerRequest: prayerRequest.trim(),
      careMemo: careMemo.trim(),
      followUpMemo: followUpMemo.trim(),
    });
    Alert.alert("완료", "사진을 제거했어.");
  };

  const save = async () => {
    if (!id || !name.trim() || saving) return;
    setSaving(true);
    try {
      await updateMember({ id, name: name.trim(), household: household.trim(), state: state.trim(), nextAction: nextAction.trim() });
      await saveLocalOverride({
        name: name.trim(),
        household: household.trim() || "가정 미지정",
        state: state.trim() || "등록",
        nextAction: nextAction.trim() || "다음 액션 미정",
        avatarUrl,
        prayerRequest: prayerRequest.trim(),
        careMemo: careMemo.trim(),
        followUpMemo: followUpMemo.trim(),
      });
      showSavedFeedback();
    } catch {
      await saveLocalOverride({
        name: name.trim(),
        household: household.trim() || "가정 미지정",
        state: state.trim() || "등록",
        nextAction: nextAction.trim() || "다음 액션 미정",
        avatarUrl,
        prayerRequest: prayerRequest.trim(),
        careMemo: careMemo.trim(),
        followUpMemo: followUpMemo.trim(),
      });
      showSavedFeedback();
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
  const topInset = Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 8 : 6;

  const setPresetState = (value: string) => {
    setState(value);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121621" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: topInset, paddingBottom: 36 }}>
        <Pressable onPress={() => router.back()} style={{ alignSelf: "flex-start", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: "#3a435f", backgroundColor: "#182038" }}>
          <Text style={{ color: "#d8e7ff", fontSize: 11 }}>← 카드 목록</Text>
        </Pressable>

        <View style={{ marginTop: 10, borderRadius: 14, borderWidth: 1, borderColor: "#3a435f", backgroundColor: "#121621", padding: 12 }}>
          <Text style={{ color: "#d8e7ff", fontSize: 11 }}>목원 상세</Text>
          <Text style={{ color: "rgba(216,230,255,0.9)", fontSize: 16, fontWeight: "700", marginTop: 6 }}>{name || "이름 미입력"}</Text>
          <Text style={{ color: "rgba(216,230,255,0.72)", fontSize: 11, marginTop: 2 }}>
            {household || "가정 미지정"} · 현재 상태 {state || "안정"}
          </Text>
          <View style={{ marginTop: 8, flexDirection: "row", gap: 10 }}>
            <View style={{ width: 132, borderRadius: 12, borderWidth: 1, borderColor: "rgba(120,157,214,0.38)", backgroundColor: "rgba(120,157,214,0.14)", padding: 8, alignItems: "center" }}>
              <View style={{ width: 96, height: 118, borderRadius: 8, backgroundColor: "#0f1a31", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                ) : (
                  <Text style={{ color: "#f5f5f5", fontSize: 18, fontWeight: "700" }}>{name.slice(0, 2)}</Text>
                )}
              </View>
              <Pressable onPress={pickImage} disabled={uploading || saving} style={{ marginTop: 8, width: "100%", minHeight: 34, borderRadius: 8, borderWidth: 1, borderColor: "#4e6590", backgroundColor: "#182038", alignItems: "center", justifyContent: "center", opacity: uploading || saving ? 0.55 : 1 }}>
                {uploading ? <ActivityIndicator size="small" color="#d8e7ff" /> : <Text style={{ color: "#d8e7ff", fontSize: 11, fontWeight: "700" }}>사진 업로드</Text>}
              </Pressable>
              {avatarUrl ? (
                <Pressable onPress={clearImage} disabled={uploading || saving} style={{ marginTop: 6, width: "100%", minHeight: 30, borderRadius: 8, borderWidth: 1, borderColor: "#6a4a4a", backgroundColor: "#251919", alignItems: "center", justifyContent: "center", opacity: uploading || saving ? 0.55 : 1 }}>
                  <Text style={{ color: "#f1c2c2", fontSize: 11, fontWeight: "700" }}>사진 제거</Text>
                </Pressable>
              ) : null}
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

        <View style={{ marginTop: 10, borderRadius: 12, borderWidth: 1, borderColor: "#3a3a3a", backgroundColor: "#121212", padding: 10, gap: 10 }}>
          <View style={{ gap: 4 }}>
            <Text style={{ color: "rgba(216,230,255,0.72)", fontSize: 10 }}>목원 이름</Text>
            <TextInput value={name} onChangeText={setName} placeholder="예: 최재성" placeholderTextColor="rgba(245,245,245,0.45)" style={{ minHeight: 40, borderRadius: 10, borderWidth: 1, borderColor: "#343434", backgroundColor: "#181818", color: "#f5f5f5", paddingHorizontal: 10 }} />
          </View>

          <View style={{ gap: 4 }}>
            <Text style={{ color: "rgba(216,230,255,0.72)", fontSize: 10 }}>소속 가정/목장</Text>
            <TextInput value={household} onChangeText={setHousehold} placeholder="예: 더루멘 1목장" placeholderTextColor="rgba(245,245,245,0.45)" style={{ minHeight: 40, borderRadius: 10, borderWidth: 1, borderColor: "#343434", backgroundColor: "#181818", color: "#f5f5f5", paddingHorizontal: 10 }} />
          </View>

          <View style={{ gap: 6 }}>
            <Text style={{ color: "rgba(216,230,255,0.72)", fontSize: 10 }}>목양 상태</Text>
            <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
              {STATUS_OPTIONS.map((preset) => (
                <Pressable
                  key={preset}
                  onPress={() => setPresetState(preset)}
                  style={{
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: state === preset ? "#7aa0d6" : "#3a3a3a",
                    backgroundColor: state === preset ? "#1a2740" : "#171717",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  <Text style={{ color: "#d8e7ff", fontSize: 10 }}>{preset}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={{ gap: 4 }}>
            <Text style={{ color: "rgba(216,230,255,0.72)", fontSize: 10 }}>기도제목</Text>
            <TextInput
              value={prayerRequest}
              onChangeText={setPrayerRequest}
              multiline
              textAlignVertical="top"
              placeholder="기도가 필요한 내용을 기록"
              placeholderTextColor="rgba(245,245,245,0.45)"
              style={{ minHeight: 72, borderRadius: 10, borderWidth: 1, borderColor: "#343434", backgroundColor: "#181818", color: "#f5f5f5", paddingHorizontal: 10, paddingVertical: 10 }}
            />
          </View>

          <View style={{ gap: 4 }}>
            <Text style={{ color: "rgba(216,230,255,0.72)", fontSize: 10 }}>돌봄 메모</Text>
            <TextInput
              value={careMemo}
              onChangeText={setCareMemo}
              multiline
              textAlignVertical="top"
              placeholder="상담/심방/상태 변화를 기록"
              placeholderTextColor="rgba(245,245,245,0.45)"
              style={{ minHeight: 86, borderRadius: 10, borderWidth: 1, borderColor: "#343434", backgroundColor: "#181818", color: "#f5f5f5", paddingHorizontal: 10, paddingVertical: 10 }}
            />
          </View>

          <View style={{ gap: 4 }}>
            <Text style={{ color: "rgba(216,230,255,0.72)", fontSize: 10 }}>후속 연락 메모</Text>
            <TextInput
              value={followUpMemo}
              onChangeText={setFollowUpMemo}
              multiline
              textAlignVertical="top"
              placeholder="언제, 어떤 방식으로 다시 연락할지 기록"
              placeholderTextColor="rgba(245,245,245,0.45)"
              style={{ minHeight: 86, borderRadius: 10, borderWidth: 1, borderColor: "#343434", backgroundColor: "#181818", color: "#f5f5f5", paddingHorizontal: 10, paddingVertical: 10 }}
            />
          </View>

          <View style={{ gap: 4 }}>
            <Text style={{ color: "rgba(216,230,255,0.72)", fontSize: 10 }}>다음 목양 액션</Text>
            <TextInput value={nextAction} onChangeText={setNextAction} placeholder="예: 화요일 저녁 안부 연락, 금요일 심방" placeholderTextColor="rgba(245,245,245,0.45)" style={{ minHeight: 46, borderRadius: 10, borderWidth: 1, borderColor: "#343434", backgroundColor: "#181818", color: "#f5f5f5", paddingHorizontal: 10 }} />
          </View>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable onPress={save} disabled={saving || !name.trim()} style={{ flex: 1, minHeight: 42, borderRadius: 10, borderWidth: 1, borderColor: "#5aa36f", backgroundColor: "#152419", alignItems: "center", justifyContent: "center", opacity: saving || !name.trim() ? 0.55 : 1 }}>
              <Text style={{ color: "#d7ffe3", fontWeight: "700" }}>{saving ? "저장 중..." : "저장"}</Text>
            </Pressable>
            <Pressable onPress={remove} disabled={saving} style={{ flex: 1, minHeight: 42, borderRadius: 10, borderWidth: 1, borderColor: "#c95c5c", backgroundColor: "#2a1515", alignItems: "center", justifyContent: "center", opacity: saving ? 0.55 : 1 }}>
              <Text style={{ color: "#f1c2c2", fontWeight: "700" }}>삭제</Text>
            </Pressable>
          </View>

          {savedFeedback ? <Text style={{ color: "#a5f3b6", fontSize: 11, marginTop: 6 }}>저장됨</Text> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
