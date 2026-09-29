import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export const ogLocale: Record<Locale, string> = {
  pl: "pl_PL",
  en: "en_US",
};

export function buildAlternates(locale: Locale, href: string) {
  const languages: Record<string, string> = {};
  for (const lang of routing.locales) {
    languages[lang] = getPathname({ locale: lang, href });
  }
  languages["x-default"] = getPathname({ locale: routing.defaultLocale, href });

  return {
    canonical: getPathname({ locale, href }),
    languages,
  };
}

interface PageMetadataInput {
  locale: Locale;
  href: string;
  title: string | { absolute: string };
  description: string;
  siteName: string;
}

export function buildPageMetadata({
  locale,
  href,
  title,
  description,
  siteName,
}: PageMetadataInput): Metadata {
  const alternates = buildAlternates(locale, href);
  const plainTitle = typeof title === "string" ? title : title.absolute;

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: "website",
      url: alternates.canonical,
      siteName,
      title: plainTitle,
      description,
      locale: ogLocale[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
    },
    twitter: {
      card: "summary_large_image",
      title: plainTitle,
      description,
    },
  };
}
