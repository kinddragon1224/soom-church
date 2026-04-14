import { useState } from "react";
import { Linking, Pressable, SafeAreaView, Text, View } from "react-native";
import * as ExpoLinking from "expo-linking";
import { router } from "expo-router";

import { setAuthConnected, setCurrentAccountKey } from "../lib/auth-bridge";

const WEB_BASE_URL = process.env.EXPO_PUBLIC_WEB_BASE_URL ?? "https://soom.io.kr";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const openWebLogin = async () => {
    const appReturnUrl = encodeURIComponent(ExpoLinking.createURL("auth-complete"));
    const next = encodeURIComponent(`/app/mobile/return?appReturnUrl=${appReturnUrl}`);
    const url = `${WEB_BASE_URL}/login?next=${next}`;
    await Linking.openURL(url);
  };

  const completeLogin = async () => {
    setLoading(true);
    await setCurrentAccountKey("manual-local");
    await setAuthConnected(true);
    router.replace("/(tabs)/world");
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
            style={{ minHeight: 54, borderRadius: 999, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ color: "#07111f", fontSize: 15, fontWeight: "700" }}>웹에서 로그인하기</Text>
          </Pressable>

          <Pressable
            onPress={completeLogin}
            disabled={loading}
            style={{ minHeight: 54, borderRadius: 999, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", backgroundColor: "rgba(255,255,255,0.04)", alignItems: "center", justifyContent: "center", opacity: loading ? 0.6 : 1 }}
          >
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>{loading ? "연결 중..." : "수동 완료(예외용)"}</Text>
          </Pressable>

          <Text style={{ color: "rgba(255,255,255,0.52)", fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 6 }}>
            현재는 로그인 브리지 1차. 다음 단계에서 세션 자동확인 API를 붙인다.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
