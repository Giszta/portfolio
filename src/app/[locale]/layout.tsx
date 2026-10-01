import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { resolveLocale, type LocaleParams } from "@/i18n/locale";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { siteUrl } from "@/lib/site";
import "@/styles/globals.css";
import { SiteFooter } from "@/components/layout";
import { SiteHeader, SkipLink } from "@/components/navigation";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "seo" });

  return {
    metadataBase: siteUrl,
    title: { default: t("siteName"), template: `%s · ${t("siteName")}` },
    applicationName: t("siteName"),
  };
}

interface LocaleLayoutProps extends LocaleParams {
  children: ReactNode;
}

export default async function LocaleLayout({ children, params }: Readonly<LocaleLayoutProps>) {
  const locale = await resolveLocale(params);

  return (
    <html lang={locale} className={fontVariables} data-scroll-behavior="smooth">
      <body className="flex min-h-dvh flex-col bg-canvas font-sans text-fg antialiased">
        <NextIntlClientProvider>
          <SkipLink />
          <SiteHeader />
          {children}
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
