import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { routing } from "@/i18n/routing";
import { siteConfig, type SiteConfig } from "./site";

const { cv }: Pick<SiteConfig, "cv"> = siteConfig;

describe("siteConfig.cv", () => {
  it.each(routing.locales)("points to an existing PDF in public/ for %s", (locale) => {
    if (!cv) return;

    const href = cv[locale];
    expect(href).toMatch(/^\/.+\.pdf$/);
    expect(existsSync(join(process.cwd(), "public", href)), `missing public${href}`).toBe(true);
  });
});
