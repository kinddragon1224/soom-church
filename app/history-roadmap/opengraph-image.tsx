import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "한국사 진로 세특 로드맵";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 50% 20%, rgba(231,189,98,0.28), transparent 28%), linear-gradient(135deg, #061326 0%, #0a1830 55%, #111827 100%)",
          color: "#fffaf0",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "fit-content",
            border: "1px solid rgba(231,189,98,0.45)",
            borderRadius: 999,
            padding: "12px 22px",
            color: "#e7bd62",
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: -1,
          }}
        >
          한국사 진로 세특 로드맵
        </div>
        <div
          style={{
            marginTop: 42,
            display: "flex",
            flexDirection: "column",
            fontSize: 86,
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: -5,
          }}
        >
          <span>내 진로로</span>
          <span>다시 읽는 한국사</span>
        </div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            width: "80%",
            borderRadius: 34,
            background: "#fffaf0",
            color: "#172033",
            padding: "24px 30px",
            fontSize: 32,
            fontWeight: 800,
            boxShadow: "0 28px 80px rgba(0,0,0,0.32)",
          }}
        >
          예: 고2 간호사 일제강점기 탐구보고서
        </div>
        <div style={{ marginTop: 26, color: "rgba(255,250,240,0.68)", fontSize: 28, fontWeight: 700 }}>
          한국사를 외우는 과목에서, 내 진로를 설명하는 탐구 과목으로.
        </div>
      </div>
    ),
    size,
  );
}
