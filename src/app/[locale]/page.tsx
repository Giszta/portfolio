import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/hero";
import { SectionShell } from "@/components/layout";
import { resolveLocale, type LocaleParams } from "@/i18n/locale";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "seo" });

  return buildPageMetadata({
    locale,
    href: "/",
    title: { absolute: t("home.title") },
    description: t("home.description"),
    siteName: t("siteName"),
  });
}

export default function HomePage() {
  const t = useTranslations();
  const contactTitle = [t("contact.titleOutline"), t("contact.titleSolid")].join(" ");

  return (
    <main id="main-content">
      <Hero />
      <SectionShell id="about" title={t("about.title")} />
      <SectionShell id="projects" title={t("projects.title")} tone="surface" />
      <SectionShell id="engineering" title={t("engineering.title")} />
      <SectionShell id="technology" title={t("technology.title")} tone="surface" />
      <SectionShell id="contact" title={contactTitle} />
    </main>
  );
}
