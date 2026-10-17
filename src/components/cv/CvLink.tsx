import { useLocale } from "next-intl";
import type { AnchorHTMLAttributes } from "react";
import { siteConfig, type SiteConfig } from "@/content/site";

type CvLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "download" | "hrefLang" | "type"
>;

/**
 * Link do pliku CV w języku strony. Odpowiada tylko za semantykę pliku
 * (adres, nazwa pobieranego pliku, język, typ); wygląd i treść ustala wywołujący.
 * Gdy CV w danym języku nie istnieje, nie renderuje nic.
 */
export function CvLink(props: CvLinkProps) {
  const locale = useLocale();
  const { cv }: Pick<SiteConfig, "cv"> = siteConfig;
  const href = cv?.[locale];

  if (!href) return null;

  const fileName = `${siteConfig.name.replace(/\s+/g, "-")}-CV-${locale.toUpperCase()}.pdf`;

  return <a {...props} href={href} download={fileName} hrefLang={locale} type="application/pdf" />;
}
