import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { resolveLocale, type LocaleParams } from "@/i18n/locale";
import { siteUrl } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The image is rendered by Satori outside the page CSS, so Tailwind tokens are not available here.
const COLORS = {
  canvas: "#070a0f",
  line: "#1d2733",
  fg: "#e8eef5",
  muted: "#8aa0b4",
  cyan: "#22d3ee",
  amber: "#f5a524",
} as const;

const FONT_DIR = join(process.cwd(), "node_modules/@fontsource/archivo/files");

// Satori needs explicit font data. Latin-ext is required for Polish diacritics (ż, ł, ę…).
const FONT_FILES = [
  { name: "Archivo", file: "archivo-latin-700-normal.woff", weight: 700 },
  { name: "ArchivoExt", file: "archivo-latin-ext-700-normal.woff", weight: 700 },
] as const;

async function loadFonts() {
  return Promise.all(
    FONT_FILES.map(async ({ name, file, weight }) => ({
      name,
      data: await readFile(join(FONT_DIR, file)),
      weight,
      style: "normal" as const,
    })),
  );
}

async function loadIconDataUri(): Promise<string> {
  const svg = await readFile(join(process.cwd(), "src/app/icon.svg"));
  return `data:image/svg+xml;base64,${svg.toString("base64")}`;
}

export default async function OpengraphImage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "seo.og" });
  const [fonts, icon] = await Promise.all([loadFonts(), loadIconDataUri()]);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        padding: 72,
        background: COLORS.canvas,
        border: `2px solid ${COLORS.line}`,
        fontFamily: "Archivo, ArchivoExt",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: COLORS.cyan,
          }}
        >
          {t("name")}
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.05,
              color: COLORS.fg,
            }}
          >
            {t("headline")}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 30,
              fontWeight: 700,
              lineHeight: 1.3,
              color: COLORS.muted,
            }}
          >
            {t("tagline")}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: COLORS.amber }}>
          {siteUrl.host}
        </div>
      </div>
      <img src={icon} width={280} height={280} alt="" style={{ alignSelf: "center" }} />
    </div>,
    { ...size, fonts },
  );
}
