import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { NavLinks } from "@/components/navigation/NavLinks";
import { Container } from "@/components/ui";
import { siteConfig } from "@/content/site";
import { getSocialLinks } from "@/lib/social";
import { GeoLabel } from "./GeoLabel";
import { cn } from "@/lib/utils/cn";

const linkClass =
  "group inline-flex items-center gap-2 text-sm text-fg-secondary transition-colors hover:text-fg";
const nudge = "transition-transform duration-200 ease-standard";

export function SiteFooter() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();
  const socialLinks = getSocialLinks(siteConfig.links);

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <Container className="grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <p className="font-display text-2xl font-semibold tracking-tight text-fg">
            {siteConfig.name}
          </p>
          <p className="font-mono text-label tracking-widest text-fg-secondary uppercase">
            {t("tagline")}
          </p>
          <GeoLabel className="pt-6" />
        </div>

        <nav aria-label={t("navLabel")}>
          <NavLinks variant="footer" />
        </nav>

        <nav aria-label={t("socialLabel")}>
          <ul className="flex flex-col gap-2">
            {socialLinks.map(({ key, href }) => {
              const Icon = key === "email" ? Mail : ArrowUpRight;
              return (
                <li key={key}>
                  <a href={href} rel={key === "email" ? undefined : "me"} className={linkClass}>
                    {t(key)}
                    <Icon
                      aria-hidden="true"
                      className={cn(
                        "size-4",
                        nudge,
                        key !== "email" &&
                          "group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                      )}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </Container>

      <Container className="flex flex-col-reverse gap-4 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-fg-muted">{t("copyright", { year, name: siteConfig.name })}</p>
        <div className="flex items-center gap-6">
          <a href="#main-content" className={linkClass}>
            {t("backToTop")}
            <ArrowUp
              aria-hidden="true"
              className={cn("size-4", nudge, "group-hover:-translate-y-0.5")}
            />
          </a>
          <LanguageSwitcher label={t("languageLabel")} />
        </div>
      </Container>
    </footer>
  );
}
