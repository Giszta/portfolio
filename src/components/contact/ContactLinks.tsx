import { ArrowUpRight, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { CvLink } from "@/components/cv";
import { siteConfig, type SiteConfig } from "@/content/site";
import { getSocialLinks } from "@/lib/social";

const ROW =
  "group flex items-center justify-between gap-4 border-b border-line py-4 text-fg transition-colors hover:text-accent";

/** Ścieżka adresu bez końcowego ukośnika, np. „/in/adam-giszter". */
function pathOf(href: string): string {
  return new URL(href).pathname.replace(/\/$/, "");
}

export function ContactLinks() {
  const t = useTranslations("contact");
  const tFooter = useTranslations("footer");
  const tCommon = useTranslations("common");
  const tHero = useTranslations("hero");
  const { cv }: Pick<SiteConfig, "cv"> = siteConfig;
  const profiles = getSocialLinks(siteConfig.links).filter(({ key }) => key !== "email");

  return (
    <ul aria-label={t("linksLabel")} className="border-t border-line-strong">
      {profiles.map(({ key, href }) => (
        <li key={key}>
          <a href={href} rel="me" className={ROW}>
            <span className="flex items-baseline gap-3">
              <span className="font-semibold">{tFooter(key)}</span>
              <span className="font-mono text-xs text-fg-muted">{pathOf(href)}</span>
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 text-cyan transition-transform duration-200 ease-standard group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </li>
      ))}
      {cv && (
        <li>
          <CvLink className={ROW}>
            <span className="flex items-baseline gap-3">
              <span className="font-semibold">{tCommon("downloadCv")}</span>
              <span className="font-mono text-xs text-fg-muted">{tHero("cvFormat")}</span>
            </span>
            <Download aria-hidden="true" className="size-4 text-cyan" />
          </CvLink>
        </li>
      )}
    </ul>
  );
}
