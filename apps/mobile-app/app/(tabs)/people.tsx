import { SafeAreaView, ScrollView, Text, View } from "react-native";

import { mabiTheme } from "../../lib/ui-theme";
import { useWorldStore } from "../../lib/world-store";

function PersonCard({ name, household, state, nextAction }: { name: string; household: string; state: string; nextAction: string }) {
  return (
    <View style={{ borderRadius: 12, borderWidth: 2, borderColor: mabiTheme.pixelBorder, backgroundColor: mabiTheme.pixelPanel, padding: 12 }}>
      <View style={{ alignSelf: "flex-start", borderRadius: 6, borderWidth: 1, borderColor: "rgba(243,208,128,0.45)", backgroundColor: "rgba(243,208,128,0.18)", paddingHorizontal: 8, paddingVertical: 3 }}>
        <Text style={{ color: mabiTheme.pixelAccent, fontSize: 11, fontWeight: "700" }}>{household}</Text>
      </View>
      <Text style={{ color: mabiTheme.pixelInk, fontSize: 16, fontWeight: "700", marginTop: 7 }}>{name}</Text>
      <Text style={{ color: "rgba(245,242,232,0.82)", marginTop: 4 }}>{state}</Text>
      <Text style={{ color: "rgba(245,242,232,0.6)", marginTop: 6, fontSize: 12 }}>다음 행동: {nextAction}</Text>
    </View>
  );
}

export default function PeopleScreen() {
  const { loading, snapshot } = useWorldStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: mabiTheme.background }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120, gap: 12 }}>
        <Text style={{ color: mabiTheme.textMuted, fontSize: 11, letterSpacing: 2 }}>SOOM PEOPLE</Text>
        <Text style={{ color: mabiTheme.textPrimary, fontSize: 29, fontWeight: "700", lineHeight: 34 }}>마을 주민 상태</Text>

        {loading || !snapshot ? (
          <Text style={{ color: "rgba(255,255,255,0.7)" }}>사람 데이터를 불러오는 중...</Text>
        ) : (
          snapshot.peopleRecords.map((person) => (
            <PersonCard key={person.id} name={person.name} household={person.household} state={person.state} nextAction={person.nextAction} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
