import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
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
          background: "linear-gradient(135deg, #05263b 0%, #030c14 60%, #08090b 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "10px 28px",
            borderRadius: 999,
            border: "1px solid rgba(37,208,192,0.4)",
            color: "#25d0c0",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 36,
          }}
        >
          HKU AI+ Challenge — Smart City &amp; Biodiversity
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 700,
            color: "#e8f6f4",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          JalSaafi
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#9fb8c4",
            marginTop: 20,
          }}
        >
          Clean water, cleared autonomously.
        </div>
      </div>
    ),
    { ...size }
  );
}
