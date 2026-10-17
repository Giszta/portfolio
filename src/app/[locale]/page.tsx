import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { AboutSection } from "@/components/about";
import { EngineeringSection } from "@/components/engineering";
import { Hero } from "@/components/hero";
import { SectionShell } from "@/components/layout";
import { ProjectsSection } from "@/components/projects";
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
      <AboutSection />
      <ProjectsSection />
      <EngineeringSection />
      <SectionShell id="technology" title={t("technology.title")} tone="surface" />
      <SectionShell id="contact" title={contactTitle} />
    </main>
  );
}
