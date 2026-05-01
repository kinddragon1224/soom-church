import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          overflow: "hidden",
          background: "radial-gradient(circle at 28% 50%, #5713d8 0%, #17072e 34%, #050507 72%)",
          color: "white",
          fontFamily: "Pretendard, Apple SD Gothic Neo, sans-serif",
          padding: "62px 72px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 18%, rgba(198, 120, 255, 0.78) 0%, rgba(198, 120, 255, 0) 26%), radial-gradient(circle at 78% 70%, rgba(255, 57, 36, 0.42) 0%, rgba(255, 57, 36, 0) 30%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -140,
            bottom: -160,
            width: 520,
            height: 520,
            borderRadius: 999,
            border: "4px solid rgba(212, 157, 255, 0.35)",
          }}
        />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 24, width: 610 }}>
          <div
            style={{
              display: "flex",
              width: 420,
              border: "1px solid rgba(255, 228, 92, 0.36)",
              background: "rgba(255, 228, 92, 0.12)",
              color: "#ffe45c",
              borderRadius: 999,
              padding: "12px 20px",
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: "0.16em",
            }}
          >
            SERVER 64 · KOREA CLUB
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 98, lineHeight: 0.86, fontWeight: 1000, letterSpacing: "-0.08em" }}>
              KOREA
            </div>
            <div style={{ marginTop: 22, fontSize: 44, lineHeight: 1, fontWeight: 1000, color: "#f2d7ff" }}>
              클럽장 백마탄
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 30, fontWeight: 900 }}>
            <div>오픈톡 검색: 킹오파 KOREA</div>
            <div style={{ color: "#ffe45c" }}>참여코드 7223</div>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            width: 365,
            height: 365,
            borderRadius: 999,
            border: "3px solid rgba(224, 179, 255, 0.58)",
            background: "radial-gradient(circle at 50% 28%, #b77aff 0%, #5a18d8 38%, #090411 74%)",
            boxShadow: "0 0 80px rgba(156, 77, 255, 0.48)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div style={{ position: "absolute", inset: 18, borderRadius: 999, border: "2px solid rgba(255,255,255,0.18)" }} />
          <div style={{ fontSize: 23, fontWeight: 1000, letterSpacing: "0.18em", color: "#f1d6ff" }}>CLUB MASTER</div>
          <div style={{ marginTop: 18, fontSize: 66, fontWeight: 1000, letterSpacing: "-0.1em" }}>백마탄</div>
          <div style={{ marginTop: 14, fontSize: 25, fontWeight: 1000, letterSpacing: "0.16em", color: "#d9b7ff" }}>KOF AFK</div>
        </div>
      </div>
    ),
    size,
  );
}
