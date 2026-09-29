import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { buttonStyles, Container } from "@/components/ui";
import { isProjectSlug, PROJECT_SLUGS } from "@/content/projects/slugs";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/i18n/locale";
import { buildPageMetadata } from "@/lib/seo/metadata";

interface ProjectPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return PROJECT_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

async function resolveProjectParams(params: ProjectPageProps["params"]) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  if (!isProjectSlug(slug)) {
    notFound();
  }
  return { locale, slug };
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await resolveProjectParams(params);
  const t = await getTranslations({ locale });

  const title = t(`caseStudies.${slug}.title`);
  const subtitle = t(`caseStudies.${slug}.subtitle`);

  return buildPageMetadata({
    locale,
    href: `/projects/${slug}`,
    title,
    description: t("seo.project.description", { title, subtitle }),
    siteName: t("seo.siteName"),
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, slug } = await resolveProjectParams(params);
  const t = await getTranslations({ locale, namespace: "caseStudies" });

  return (
    <main id="main-content">
      <Container className="flex flex-col items-start gap-6 py-24">
        <Link href="/" className={buttonStyles({ variant: "ghost", size: "sm" })}>
          {t("backToProjects")}
        </Link>
        <h1 className="font-display text-display-lg font-bold">{t(`${slug}.title`)}</h1>
        <p className="text-lg text-fg-secondary">{t(`${slug}.subtitle`)}</p>
      </Container>
    </main>
  );
}
