import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

import { mabiTheme } from "../lib/ui-theme";
import { type MemberSource, saveWorldSetupState } from "../lib/world-setup";

const MEMBER_SOURCE_OPTIONS: { id: MemberSource; title: string; desc: string }[] = [
  { id: "manual", title: "직접 입력", desc: "목원 정보를 앱에서 바로 입력" },
  { id: "csv", title: "CSV 업로드", desc: "기존 명단 파일로 한 번에 등록" },
  { id: "chat", title: "모라 명령", desc: "채팅으로 목원 추가/정리" },
];

export default function WorldSetupScreen() {
  const [churchName, setChurchName] = useState("");
  const [region, setRegion] = useState("");
  const [mokjangName, setMokjangName] = useState("");
  const [memberSource, setMemberSource] = useState<MemberSource>("chat");
  const [memberTargetCount, setMemberTargetCount] = useState("");
  const [saving, setSaving] = useState(false);

  const canSubmit = useMemo(() => {
    return churchName.trim().length > 0 && region.trim().length > 0 && mokjangName.trim().length > 0;
  }, [churchName, region, mokjangName]);

  const submit = async () => {
    if (!canSubmit || saving) return;

    setSaving(true);
    try {
      await saveWorldSetupState({
        churchName,
        region,
        mokjangName,
        memberSource,
        memberTargetCount: Number(memberTargetCount) || 0,
      });
      router.replace("/(tabs)/world");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: mabiTheme.background }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 28, gap: 12 }}>
        <View style={{ borderRadius: 16, borderWidth: 1, borderColor: "rgba(120,157,214,0.35)", backgroundColor: "rgba(20,29,45,0.92)", padding: 12, gap: 8 }}>
          <Text style={{ color: "#f4f7ff", fontSize: 16, fontWeight: "800" }}>목장 월드 시작 설정</Text>
          <Text style={{ color: "rgba(220,232,255,0.72)", fontSize: 12 }}>처음 한 번만 설정하면 바로 월드가 열린다.</Text>
        </View>

        <View style={{ borderRadius: 14, borderWidth: 1, borderColor: "rgba(148,171,212,0.35)", backgroundColor: "rgba(26,35,52,0.9)", padding: 12, gap: 10 }}>
          <Text style={{ color: "#ffeabf", fontWeight: "700" }}>1) 기본 정보</Text>
          <TextInput value={churchName} onChangeText={setChurchName} placeholder="교회 이름" placeholderTextColor="rgba(220,232,255,0.46)" style={{ borderRadius: 10, borderWidth: 1, borderColor: "rgba(120,157,214,0.45)", backgroundColor: "rgba(255,255,255,0.08)", color: "#f4f7ff", paddingHorizontal: 10, paddingVertical: 10 }} />
          <TextInput value={region} onChangeText={setRegion} placeholder="지역 (예: 수원 영통)" placeholderTextColor="rgba(220,232,255,0.46)" style={{ borderRadius: 10, borderWidth: 1, borderColor: "rgba(120,157,214,0.45)", backgroundColor: "rgba(255,255,255,0.08)", color: "#f4f7ff", paddingHorizontal: 10, paddingVertical: 10 }} />
          <TextInput value={mokjangName} onChangeText={setMokjangName} placeholder="목장 이름" placeholderTextColor="rgba(220,232,255,0.46)" style={{ borderRadius: 10, borderWidth: 1, borderColor: "rgba(120,157,214,0.45)", backgroundColor: "rgba(255,255,255,0.08)", color: "#f4f7ff", paddingHorizontal: 10, paddingVertical: 10 }} />
        </View>

        <View style={{ borderRadius: 14, borderWidth: 1, borderColor: "rgba(148,171,212,0.35)", backgroundColor: "rgba(26,35,52,0.9)", padding: 12, gap: 10 }}>
          <Text style={{ color: "#ffeabf", fontWeight: "700" }}>2) 목원 목록 시작 방식</Text>
          {MEMBER_SOURCE_OPTIONS.map((option) => {
            const active = memberSource === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => setMemberSource(option.id)}
                style={{
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: active ? "rgba(243,208,128,0.65)" : "rgba(148,171,212,0.35)",
                  backgroundColor: active ? "rgba(243,208,128,0.16)" : "rgba(255,255,255,0.04)",
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                }}
              >
                <Text style={{ color: "#f4f7ff", fontWeight: "700" }}>{option.title}</Text>
                <Text style={{ color: "rgba(220,232,255,0.72)", fontSize: 12, marginTop: 3 }}>{option.desc}</Text>
              </Pressable>
            );
          })}
          <TextInput value={memberTargetCount} onChangeText={setMemberTargetCount} keyboardType="number-pad" placeholder="초기 예상 인원 (선택 입력)" placeholderTextColor="rgba(220,232,255,0.46)" style={{ borderRadius: 10, borderWidth: 1, borderColor: "rgba(120,157,214,0.45)", backgroundColor: "rgba(255,255,255,0.08)", color: "#f4f7ff", paddingHorizontal: 10, paddingVertical: 10 }} />
          <Text style={{ color: "rgba(220,232,255,0.66)", fontSize: 11 }}>목장 규모는 고정값이 아니다. 5명~대규모까지 모두 지원하는 가변 구조로 처리.</Text>
        </View>

        <View style={{ borderRadius: 14, borderWidth: 1, borderColor: "rgba(143,224,170,0.4)", backgroundColor: "rgba(12,35,24,0.38)", padding: 12, gap: 8 }}>
          <Text style={{ color: "#d7ffe3", fontWeight: "700" }}>월드 생성 후 바로 열리는 액션</Text>
          <Text style={{ color: "rgba(216,255,229,0.78)", fontSize: 12 }}>출석 체크, 긴급 돌봄/기도, 심방 일정, 이번 주 목장 일정부터 바로 시작.</Text>
        </View>

        <Pressable
          onPress={submit}
          disabled={!canSubmit || saving}
          style={{
            minHeight: 48,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "rgba(243,208,128,0.55)",
            backgroundColor: "rgba(243,208,128,0.18)",
            alignItems: "center",
            justifyContent: "center",
            opacity: !canSubmit || saving ? 0.55 : 1,
          }}
        >
          {saving ? <ActivityIndicator color="#ffeabf" size="small" /> : <Text style={{ color: "#ffeabf", fontWeight: "800" }}>월드 생성하고 시작하기</Text>}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
