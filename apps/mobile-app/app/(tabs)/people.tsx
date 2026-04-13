import { SafeAreaView, ScrollView, Text, View } from "react-native";

import { peopleRecords } from "../../lib/world-model";

function PersonCard({ name, household, state, nextAction }: { name: string; household: string; state: string; nextAction: string }) {
  return (
    <View style={{ borderRadius: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.05)", padding: 14 }}>
      <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{name}</Text>
      <Text style={{ color: "rgba(255,255,255,0.68)", marginTop: 4 }}>{household}</Text>
      <Text style={{ color: "rgba(255,255,255,0.82)", marginTop: 6 }}>{state}</Text>
      <Text style={{ color: "rgba(255,255,255,0.58)", marginTop: 4, fontSize: 12 }}>다음 행동: {nextAction}</Text>
    </View>
  );
}

export default function PeopleScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#07111f" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120, gap: 12 }}>
        <Text style={{ color: "rgba(255,255,255,0.46)", fontSize: 11, letterSpacing: 2 }}>SOOM PEOPLE</Text>
        <Text style={{ color: "#fff", fontSize: 29, fontWeight: "700", lineHeight: 34 }}>사람과 가정 흐름</Text>

        {peopleRecords.map((person) => (
          <PersonCard key={person.id} name={person.name} household={person.household} state={person.state} nextAction={person.nextAction} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
