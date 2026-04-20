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
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          color: "#0f172a",
          fontFamily: "Pretendard, Apple SD Gothic Neo, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: "0.02em",
            marginBottom: 16,
            color: "#475569",
          }}
        >
          이삭영유아부 일일교사 가이드
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          이삭영유아부 대본 뷰어
        </div>
      </div>
    ),
    size
  );
}
