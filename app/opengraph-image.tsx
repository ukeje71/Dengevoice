import { ImageResponse } from "next/og";

// Dynamically generated social share card. Uses the brand palette so links
// shared into WhatsApp / X / Slack (judges, demo-video viewers) render as
// DengeVoice rather than a blank preview. Only flexbox + a CSS subset are
// supported here, so this is kept deliberately simple.
export const alt =
  "DengeVoice — report a problem in your own words, in mixed Igbo and English";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand tokens (mirrors app/globals.css @theme). Hex is required here because
// ImageResponse can't resolve Tailwind classes or CSS variables.
const PAPER = "#F7EFDD";
const INDIGO = "#22304A";
const MARIGOLD = "#E8A33D";
const BRICK = "#C1502E";
const PALM = "#4F7942";

export default function OpengraphImage() {
  const bars = [40, 90, 150, 110, 180, 70, 130, 60];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 20,
              background: INDIGO,
              color: PAPER,
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            D
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, color: INDIGO }}>
            DengeVoice
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              color: INDIGO,
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            Report a problem. In your own words.
          </div>
          <div style={{ fontSize: 32, color: "#2B211B", maxWidth: 820 }}>
            Speak naturally in Igbo and English. No station visit. No fear of
            being dismissed.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
          {bars.map((h, i) => (
            <div
              key={i}
              style={{
                width: 22,
                height: h,
                borderRadius: 999,
                background:
                  i % 3 === 0 ? MARIGOLD : i % 3 === 1 ? BRICK : PALM,
              }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
