import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// The card shown when a Roots link is shared (iMessage, Slack, Instagram,
// etc.). Built at deploy time in the site's own serif, so previews match
// the site instead of showing an arbitrary photo. Portrait pages override
// this with the person's own photo.
export const alt = "Roots — Food doesn't just come from somewhere. It comes from someone.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = join(process.cwd(), "node_modules/@fontsource/cormorant-garamond/files");

export default async function OpengraphImage() {
  const [regular, italic] = await Promise.all([
    readFile(join(fontDir, "cormorant-garamond-latin-500-normal.woff")),
    readFile(join(fontDir, "cormorant-garamond-latin-500-italic.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fcfcfa",
          padding: "72px 84px",
          fontFamily: "Cormorant",
          color: "#161615",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div style={{ fontSize: 52 }}>Roots</div>
          <div style={{ fontSize: 24, letterSpacing: 6, color: "#2f5240" }}>
            FOOD HAS ROOTS. SO DO WE.
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, lineHeight: 1.04, letterSpacing: -1 }}>
            Food doesn&rsquo;t just come from somewhere.
          </div>
          <div style={{ fontSize: 84, lineHeight: 1.04, fontStyle: "italic", color: "#2f5240", letterSpacing: -1 }}>
            It comes from someone.
          </div>
        </div>
        <div style={{ display: "flex", borderTop: "1px solid #e2e0da", paddingTop: 24, fontSize: 28, color: "#5f5e59" }}>
          Portraits of the people shaping the future of food
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: regular, style: "normal", weight: 500 },
        { name: "Cormorant", data: italic, style: "italic", weight: 500 },
      ],
    }
  );
}
