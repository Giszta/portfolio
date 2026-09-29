import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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
  const t = useTranslations("hero");
  const title = [t("titleOutline"), t("titleSolid")].join(" ");

  return (
    <main id="main-content">
      <h1 className="sr-only">{title}</h1>
    </main>
  );
}
