import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { resolveLocale, type LocaleParams } from "@/i18n/locale";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SectionShell } from "@/components/layout";
import { Container, Section } from "@/components/ui";

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
  const heroTitle = [t("hero.titleOutline"), t("hero.titleSolid")].join(" ");
  const contactTitle = [t("contact.titleOutline"), t("contact.titleSolid")].join(" ");

  return (
    <main id="main-content">
      <Section
        id="home"
        aria-labelledby="home-title"
        className="flex min-h-[calc(100dvh-4rem)] items-center"
      >
        <Container>
          <h1 id="home-title" className="max-w-4xl font-display text-display-xl text-fg">
            {heroTitle}
          </h1>
        </Container>
      </Section>

      <SectionShell id="about" title={t("about.title")} />
      <SectionShell id="projects" title={t("projects.title")} tone="surface" />
      <SectionShell id="engineering" title={t("engineering.title")} />
      <SectionShell id="technology" title={t("technology.title")} tone="surface" />
      <SectionShell id="contact" title={contactTitle} />
    </main>
  );
}
