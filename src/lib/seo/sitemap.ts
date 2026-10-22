import type { MetadataRoute } from "next";
import type { Locale } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/** Indexable pages (locale-less hrefs). Add project case studies here once they exist. */
export const INDEXABLE_HREFS = ["/"] as const;

export function buildSitemap(
  baseUrl: URL,
  hrefs: readonly string[] = INDEXABLE_HREFS,
): MetadataRoute.Sitemap {
  const absolute = (locale: Locale, href: string): string =>
    new URL(getPathname({ locale, href }), baseUrl).toString();

  return hrefs.flatMap((href) => {
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      languages[locale] = absolute(locale, href);
    }
    languages["x-default"] = absolute(routing.defaultLocale, href);

    return routing.locales.map((locale) => ({
      url: absolute(locale, href),
      alternates: { languages },
    }));
  });
}

export function buildRobots(baseUrl: URL): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: new URL("/sitemap.xml", baseUrl).toString(),
  };
}
