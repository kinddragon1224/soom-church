import { SafeAreaView, ScrollView, Text, View } from "react-native";

function PersonCard({ name, state }: { name: string; state: string }) {
  return (
    <View style={{ borderRadius: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.05)", padding: 14 }}>
      <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{name}</Text>
      <Text style={{ color: "rgba(255,255,255,0.68)", marginTop: 4 }}>{state}</Text>
    </View>
  );
}

export default function PeopleScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#07111f" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120, gap: 12 }}>
        <Text style={{ color: "rgba(255,255,255,0.46)", fontSize: 11, letterSpacing: 2 }}>SOOM PEOPLE</Text>
        <Text style={{ color: "#fff", fontSize: 29, fontWeight: "700", lineHeight: 34 }}>사람과 가정 흐름</Text>

        <PersonCard name="김요한" state="✨ 기도 필요" />
        <PersonCard name="박마리아" state="💧 돌봄 진행" />
        <PersonCard name="이다니엘" state="✉️ 후속 필요" />
      </ScrollView>
    </SafeAreaView>
  );
}
