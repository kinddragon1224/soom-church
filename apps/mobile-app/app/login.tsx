import { useState } from "react";
import { Linking, Pressable, SafeAreaView, Text, View } from "react-native";
import * as ExpoLinking from "expo-linking";

const WEB_BASE_URL = process.env.EXPO_PUBLIC_WEB_BASE_URL ?? "https://soom.io.kr";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const openWebLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const appReturnUrl = encodeURIComponent(ExpoLinking.createURL("auth-complete"));
      const next = encodeURIComponent(`/app/mobile/return?appReturnUrl=${appReturnUrl}`);
      const url = `${WEB_BASE_URL}/login?next=${next}`;
      await Linking.openURL(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#07111f" }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 26, paddingBottom: 34, justifyContent: "space-between" }}>
        <View style={{ gap: 12 }}>
          <Text style={{ color: "rgba(255,255,255,0.46)", fontSize: 11, letterSpacing: 2 }}>SOOM LOGIN BRIDGE</Text>
          <Text style={{ color: "#fff", fontSize: 34, fontWeight: "700", lineHeight: 39 }}>로그인 연결</Text>
          <Text style={{ color: "rgba(255,255,255,0.72)", fontSize: 15, lineHeight: 24 }}>
            구글 로그인은 웹에서 처리하고, 완료 후 `앱으로 돌아가기`를 누르면 자동으로 월드로 들어간다.
          </Text>
        </View>

        <View style={{ gap: 10 }}>
          <Pressable
            onPress={openWebLogin}
            disabled={loading}
            style={{ minHeight: 54, borderRadius: 999, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", opacity: loading ? 0.7 : 1 }}
          >
            <Text style={{ color: "#07111f", fontSize: 15, fontWeight: "700" }}>{loading ? "여는 중..." : "구글 계정으로 로그인"}</Text>
          </Pressable>

          <Text style={{ color: "rgba(255,255,255,0.52)", fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 6 }}>
            모바일은 구글 로그인 리턴(accountKey) 기준으로 계정 저장을 분리한다.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
