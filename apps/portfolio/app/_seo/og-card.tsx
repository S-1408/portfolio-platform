import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { ImageResponse } from "next/og";
import { seoContent } from "@repo/content";
import { siteConfig } from "./site";

export const ogImageSize = { width: 1200, height: 630 };

// Brand palette (dark theme tokens from @repo/ui) — OG images render outside
// the CSS pipeline, so the values are inlined here.
const colors = {
  background: "#10201f",
  surface: "#172b2a",
  border: "#6d8783",
  primary: "#00c6bc",
  accent: "#ff9c62",
  ink: "#edf5f3",
  muted: "#b4c5c2",
};

const mimeTypes: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

/** Reads a file from /public as a data URI (images render at build time). */
async function readPublicAsDataUri(publicPath: string) {
  const relativePath = publicPath.replace(/^\/+/, "");
  const file = await readFile(join(process.cwd(), "public", relativePath));
  const mimeType =
    mimeTypes[extname(relativePath).toLowerCase()] ?? "image/png";

  return `data:${mimeType};base64,${file.toString("base64")}`;
}

export type OgCardOptions = {
  eyebrow: string;
  title: string;
  subtitle: string;
  tags?: readonly string[];
  /** Optional screenshot from /public, shown on the right. */
  screenshot?: string;
};

export async function renderOgCard({
  eyebrow,
  title,
  subtitle,
  tags = [],
  screenshot,
}: OgCardOptions) {
  const [logo, screenshotSrc] = await Promise.all([
    // Transparent circular version of sv.png (see public/icons).
    readPublicAsDataUri("/icons/icon-192.png"),
    screenshot ? readPublicAsDataUri(screenshot) : Promise.resolve(null),
  ]);
  const titleSize = screenshotSrc ? 60 : title.length > 24 ? 72 : 88;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: colors.background,
        color: colors.ink,
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -220,
          right: -160,
          width: 620,
          height: 620,
          borderRadius: 9999,
          backgroundColor: colors.primary,
          opacity: 0.18,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -180,
          left: -120,
          width: 380,
          height: 380,
          borderRadius: 9999,
          backgroundColor: colors.accent,
          opacity: 0.14,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 16,
          backgroundColor: colors.primary,
        }}
      />

      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          gap: 32,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori needs plain img */}
          <img src={logo} width={64} height={64} alt="" />
          <span style={{ fontSize: 30, fontWeight: 700 }}>
            {seoContent.siteName}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: colors.accent,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            {eyebrow}
          </span>
          <span
            style={{
              fontSize: titleSize,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1,
            }}
          >
            {title}
          </span>
          <span style={{ fontSize: 34, color: colors.muted }}>{subtitle}</span>
          {tags.length ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 22,
                    padding: "8px 18px",
                    borderRadius: 9999,
                    border: `2px solid ${colors.border}`,
                    backgroundColor: colors.surface,
                    color: colors.ink,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <span style={{ fontSize: 24, color: colors.primary, fontWeight: 700 }}>
          {siteConfig.url.host}
        </span>
      </div>

      {screenshotSrc ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingRight: 64,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori needs plain img */}
          <img
            src={screenshotSrc}
            width={480}
            height={340}
            alt=""
            style={{
              objectFit: "cover",
              objectPosition: "top",
              borderRadius: 20,
              border: `4px solid ${colors.border}`,
            }}
          />
        </div>
      ) : null}
    </div>,
    ogImageSize,
  );
}
