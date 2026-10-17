import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { submitContact } from "@/app/actions/contact";
import { AboutSection } from "@/components/about";
import { ContactSection } from "@/components/contact";
import { EngineeringSection } from "@/components/engineering";
import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/projects";
import { TechnologySection } from "@/components/technology";
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
  return (
    <main id="main-content">
      <Hero />
      <AboutSection />
      <ProjectsSection />
      <EngineeringSection />
      <TechnologySection />
      <ContactSection action={submitContact} />
    </main>
  );
}
