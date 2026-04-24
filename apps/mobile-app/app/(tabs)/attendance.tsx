import { useCallback, useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "expo-router";

import {
  applyMemberLocalCache,
  getMemberLocalCache,
  getTodayMeetingId,
  setMemberLocalCache,
  upsertMokjangMeetingRecord,
  withMemberOverride,
  type AttendanceStatus,
  type LocalMember,
  type MemberLocalCache,
} from "../../lib/member-local-cache";
import { useWorldStore } from "../../lib/world-store";

type AttendanceDraft = {
  status: AttendanceStatus;
  absenceReason: string;
  needsFollowUp: boolean;
};

export default function AttendanceScreen() {
  const { snapshot, refreshAttendance } = useWorldStore();
  const [cache, setCache] = useState<MemberLocalCache>({ added: [], removedNames: [], overrides: {}, meetingRecords: [] });
  const [drafts, setDrafts] = useState<Record<string, AttendanceDraft>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

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

  useMemo(() => {
    const id = getTodayMeetingId();
    const todayRecord = cache.meetingRecords.find((record) => record.id === id);
    if (!todayRecord) return;

    setDrafts((prev) => {
      const next = { ...prev };
      for (const item of todayRecord.attendances) {
        if (!next[item.memberId]) {
          next[item.memberId] = {
            status: item.status,
            absenceReason: item.absenceReason ?? "",
            needsFollowUp: Boolean(item.needsFollowUp),
          };
        }
      }
      return next;
    });
  }, [cache.meetingRecords]);

  const updateStatus = (member: LocalMember, status: AttendanceStatus) => {
    setDrafts((prev) => {
      const current = prev[member.id] ?? { status: "UNKNOWN" as AttendanceStatus, absenceReason: "", needsFollowUp: false };
      const next: AttendanceDraft = {
        ...current,
        status,
        needsFollowUp: status === "ABSENT",
      };
      if (status !== "ABSENT") next.absenceReason = current.absenceReason;
      return { ...prev, [member.id]: next };
    });
  };

  const updateAbsenceReason = (memberId: string, value: string) => {
    setDrafts((prev) => ({
      ...prev,
      [memberId]: {
        status: prev[memberId]?.status ?? "ABSENT",
        needsFollowUp: true,
        absenceReason: value,
      },
    }));
  };

  const summary = useMemo(() => {
    let present = 0;
    let absent = 0;
    let online = 0;
    let followUp = 0;

    for (const member of members) {
      const status = drafts[member.id]?.status ?? "UNKNOWN";
      if (status === "PRESENT") present += 1;
      if (status === "ABSENT") absent += 1;
      if (status === "ONLINE") online += 1;
      if (drafts[member.id]?.needsFollowUp) followUp += 1;
    }

    return { total: members.length, present, absent, online, followUp };
  }, [members, drafts]);

  const save = async () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const meetingId = getTodayMeetingId();
    const meetingDate = `${yyyy}-${mm}-${dd}`;

    const existing = cache.meetingRecords.find((item) => item.id === meetingId);
    const createdAt = existing?.createdAt ?? now.toISOString();

    let nextCache = { ...cache };

    const attendances = members.map((member) => {
      const draft = drafts[member.id] ?? { status: "UNKNOWN" as AttendanceStatus, absenceReason: "", needsFollowUp: false };

      if (draft.status === "ABSENT") {
        const nextAction = !member.nextAction || member.nextAction === "다음 액션 미정" ? "이번 주 안부 연락" : member.nextAction;
        nextCache = withMemberOverride(nextCache, member.id, {
          name: member.name,
          household: member.household,
          state: "결석",
          nextAction,
          avatarUrl: member.avatarUrl,
          prayerRequest: member.prayerRequest,
          careMemo: member.careMemo,
          followUpMemo: member.followUpMemo,
        });
      }

      if (draft.status === "PRESENT") {
        const shouldSetStable = member.state === "결석";
        if (shouldSetStable) {
          nextCache = withMemberOverride(nextCache, member.id, {
            name: member.name,
            household: member.household,
            state: "안정",
            nextAction: member.nextAction,
            avatarUrl: member.avatarUrl,
            prayerRequest: member.prayerRequest,
            careMemo: member.careMemo,
            followUpMemo: member.followUpMemo,
          });
        }
      }

      return {
        memberId: member.id,
        memberName: member.name,
        status: draft.status,
        absenceReason: draft.status === "ABSENT" ? draft.absenceReason || undefined : undefined,
        needsFollowUp: draft.status === "ABSENT" ? true : false,
      };
    });

    const updatedCache = upsertMokjangMeetingRecord(nextCache, {
      id: meetingId,
      meetingDate,
      title: "이번 주 목장 모임",
      attendances,
      createdAt,
      updatedAt: now.toISOString(),
    });

    setCache(updatedCache);
    await setMemberLocalCache(updatedCache);
    await refreshAttendance();
    setFeedback("출석 기록이 저장됐습니다. 결석자는 후속 연락 목록에 반영됩니다.");
  };

  const stateChip = (state: string) => {
    const danger = state === "결석" || state === "긴급돌봄";
    return (
      <View
        style={{
          borderRadius: 999,
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderWidth: 1,
          borderColor: danger ? "#ff8b8b" : "#526487",
          backgroundColor: danger ? "rgba(255,80,80,0.14)" : "rgba(216,231,255,0.08)",
        }}
      >
        <Text style={{ color: danger ? "#ffd2d2" : "#d8e7ff", fontSize: 10, fontWeight: "700" }}>{state}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0b0d14" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 110, gap: 10 }}>
        <Text style={{ color: "rgba(230,230,230,0.56)", fontSize: 11, letterSpacing: 1.5 }}>MOKJANG ATTENDANCE</Text>
        <Text style={{ color: "#f5f5f5", fontSize: 28, fontWeight: "700", marginTop: 2 }}>이번 주 목장 출석</Text>
        <Text style={{ color: "rgba(245,245,245,0.78)", fontSize: 12, lineHeight: 18 }}>
          출석 체크는 결석자를 정죄하기 위한 기록이 아니라, 놓치지 않고 돌보기 위한 시작점입니다.
        </Text>

        <View style={{ borderRadius: 12, borderWidth: 1, borderColor: "#2b2f3a", backgroundColor: "#11141d", padding: 10, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {[`전체 ${summary.total}명`, `참석 ${summary.present}명`, `결석 ${summary.absent}명`, `온라인 ${summary.online}명`, `후속 필요 ${summary.followUp}명`].map((text) => (
            <View key={text} style={{ borderRadius: 8, borderWidth: 1, borderColor: "#3b4254", backgroundColor: "rgba(255,255,255,0.03)", paddingHorizontal: 8, paddingVertical: 6 }}>
              <Text style={{ color: "#d8e7ff", fontSize: 11, fontWeight: "700" }}>{text}</Text>
            </View>
          ))}
        </View>

        {members.length === 0 ? (
          <View style={{ marginTop: 8, borderRadius: 12, borderWidth: 1, borderColor: "#2f2f2f", backgroundColor: "#141414", padding: 12 }}>
            <Text style={{ color: "rgba(245,245,245,0.84)", fontSize: 12 }}>아직 목원이 없습니다. 먼저 목원 탭에서 이름만 입력해 첫 목원을 추가해보세요.</Text>
          </View>
        ) : (
          members.map((member) => {
            const draft = drafts[member.id] ?? { status: "UNKNOWN" as AttendanceStatus, absenceReason: "", needsFollowUp: false };
            return (
              <View key={member.id} style={{ borderRadius: 12, borderWidth: 1, borderColor: "#2b2f3a", backgroundColor: "#11141d", padding: 10, gap: 8 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: "#ffffff", fontSize: 15, fontWeight: "700" }}>{member.name}</Text>
                    <Text style={{ color: "rgba(216,231,255,0.82)", fontSize: 11, marginTop: 2 }}>{member.household}</Text>
                  </View>
                  {stateChip(member.state)}
                </View>

                <View style={{ flexDirection: "row", gap: 6 }}>
                  {[
                    { label: "참석", value: "PRESENT" as AttendanceStatus },
                    { label: "결석", value: "ABSENT" as AttendanceStatus },
                    { label: "온라인", value: "ONLINE" as AttendanceStatus },
                  ].map((option) => {
                    const active = draft.status === option.value;
                    return (
                      <Pressable
                        key={`${member.id}-${option.value}`}
                        onPress={() => updateStatus(member, option.value)}
                        style={{
                          flex: 1,
                          minHeight: 36,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: active ? "#8fe0aa" : "#3b4254",
                          backgroundColor: active ? "rgba(143,224,170,0.16)" : "rgba(255,255,255,0.03)",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ color: active ? "#d7ffe3" : "#d8e7ff", fontSize: 12, fontWeight: "700" }}>{option.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                {draft.status === "ABSENT" ? (
                  <TextInput
                    value={draft.absenceReason}
                    onChangeText={(value) => updateAbsenceReason(member.id, value)}
                    placeholder="결석 사유나 연락 메모를 적어주세요"
                    placeholderTextColor="rgba(216,231,255,0.5)"
                    style={{
                      minHeight: 40,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#526487",
                      backgroundColor: "#18202e",
                      color: "#f5f5f5",
                      paddingHorizontal: 10,
                    }}
                  />
                ) : null}
              </View>
            );
          })
        )}

        <Pressable
          onPress={save}
          style={{
            marginTop: 8,
            minHeight: 46,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#8fe0aa",
            backgroundColor: "rgba(143,224,170,0.18)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#d7ffe3", fontSize: 14, fontWeight: "800" }}>출석 기록 저장</Text>
        </Pressable>

        {feedback ? <Text style={{ color: "#bdeeca", fontSize: 12, marginTop: 4 }}>{feedback}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}
