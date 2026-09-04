import { ImageResponse } from "next/og";

// Branded favicon, generated so the tab/bookmark mark matches the app instead
// of the default Next.js placeholder. A compact waveform on the indigo brand
// square, echoing the OG card. Only flexbox + a CSS subset render here.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const PAPER = "#F7EFDD";
const INDIGO = "#22304A";
const MARIGOLD = "#E8A33D";
const BRICK = "#C1502E";
const PALM = "#4F7942";

export default function Icon() {
  const bars = [8, 16, 22, 13, 18];
  const colors = [MARIGOLD, PALM, PAPER, BRICK, MARIGOLD];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          background: INDIGO,
          borderRadius: 7,
        }}
      >
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              width: 3,
              height: h,
              borderRadius: 999,
              background: colors[i],
            }}
          />
        ))}
      </div>
    ),
    { ...size },
  );
}
