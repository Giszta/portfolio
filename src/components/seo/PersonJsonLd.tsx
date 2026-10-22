import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/content/site";
import { getPathname } from "@/i18n/navigation";
import { buildPersonJsonLd, serializeJsonLd } from "@/lib/seo/structuredData";
import { siteUrl } from "@/lib/site";

// Skills claimed here must match the portfolio content; language-neutral technology names.
const KNOWS_ABOUT = [
  "Mechanical engineering",
  "SolidWorks",
  "TypeScript",
  "React",
  "Next.js",
  "Artificial intelligence",
  "Automation",
] as const;

interface PersonJsonLdProps {
  locale: Locale;
}

export async function PersonJsonLd({ locale }: Readonly<PersonJsonLdProps>) {
  const t = await getTranslations({ locale, namespace: "seo" });

  const data = buildPersonJsonLd({
    name: siteConfig.name,
    url: new URL(getPathname({ locale, href: "/" }), siteUrl).toString(),
    jobTitle: t("person.jobTitle"),
    description: t("home.description"),
    sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
    knowsAbout: KNOWS_ABOUT,
    countryCode: siteConfig.location.countryCode,
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
