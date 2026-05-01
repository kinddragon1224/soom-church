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
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #08040b 0%, #1b0710 44%, #120827 100%)",
          color: "white",
          fontFamily: "Apple SD Gothic Neo, Pretendard, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -90,
            top: -120,
            width: 500,
            height: 500,
            borderRadius: 999,
            background: "radial-gradient(circle, rgba(255,67,40,0.76), rgba(255,67,40,0) 68%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -80,
            top: -90,
            width: 560,
            height: 560,
            borderRadius: 999,
            background: "radial-gradient(circle, rgba(119,49,255,0.68), rgba(119,49,255,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 540,
            bottom: -160,
            width: 520,
            height: 360,
            borderRadius: 999,
            background: "radial-gradient(circle, rgba(255,204,82,0.5), rgba(255,204,82,0) 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            padding: 72,
            alignItems: "center",
            justifyContent: "space-between",
            gap: 56,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                padding: "12px 20px",
                borderRadius: 999,
                border: "1px solid rgba(255,204,82,0.36)",
                background: "rgba(255,204,82,0.13)",
                color: "#ffd777",
                fontSize: 25,
                fontWeight: 900,
                letterSpacing: 5,
              }}
            >
              KOF AFK BEGINNER GUIDE
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 34,
                fontSize: 82,
                fontWeight: 1000,
                lineHeight: 0.94,
                letterSpacing: -6,
              }}
            >
              초보자 공략,
              <br />
              쉽게 갑니다.
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 28,
                fontSize: 34,
                fontWeight: 800,
                lineHeight: 1.35,
                color: "rgba(255,255,255,0.72)",
              }}
            >
              선비사의 3번째 부캐가 알려주는
              <br />
              초반 성장 루트와 실수 방지 노트
            </div>
          </div>

          <div
            style={{
              position: "relative",
              display: "flex",
              width: 310,
              height: 310,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(0,0,0,0.34)",
              boxShadow: "0 0 80px rgba(255,67,40,0.42)",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 230,
                height: 230,
                borderRadius: 56,
                transform: "rotate(45deg)",
                border: "1px solid rgba(255,204,82,0.34)",
                background: "rgba(255,255,255,0.06)",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 150,
                height: 150,
                borderRadius: 36,
                transform: "rotate(-10deg)",
                background: "linear-gradient(135deg, #ff4328, #711eff 70%, #08040b)",
                border: "1px solid rgba(255,204,82,0.46)",
              }}
            >
              <span style={{ fontSize: 86, fontWeight: 1000, letterSpacing: -14 }}>K</span>
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
