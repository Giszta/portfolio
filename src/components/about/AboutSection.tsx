import { Download } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { StatusIndicator } from "@/components/technical";
import { Section, buttonStyles } from "@/components/ui";
import { siteConfig, type SiteConfig } from "@/content/site";
import { AboutPortrait } from "./AboutPortrait";

const HEADING_ID = "about-title";

const PARAGRAPH = "max-w-[64ch] text-base leading-7 text-fg-secondary";

const engineering = (chunks: ReactNode) => (
  <strong className="font-semibold text-view-engineering">{chunks}</strong>
);

const emphasis = (chunks: ReactNode) => <strong className="font-semibold text-fg">{chunks}</strong>;

export function AboutSection() {
  const t = useTranslations("about");
  const tHero = useTranslations("hero");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { availability, cv }: Pick<SiteConfig, "availability" | "cv"> = siteConfig;
  const cvHref = cv?.[locale];

  return (
    <Section id="about" aria-labelledby={HEADING_ID} spacing="none">
      <div className="grid lg:grid-cols-[46fr_54fr]">
        <AboutPortrait className="h-96 sm:h-112 lg:h-auto lg:min-h-220" />

        <div className="px-4 py-12 sm:px-6 sm:py-16 lg:py-24 lg:pr-[max(2rem,calc((100vw_-_72rem)/2_+_2rem))] lg:pl-18">
          <h2
            id={HEADING_ID}
            className="max-w-[20ch] font-display text-display-md text-balance text-fg"
          >
            {t("title")}
          </h2>

          <div className="mt-10 flex flex-col gap-6">
            <p className="max-w-[46ch] text-lg leading-relaxed text-fg lg:text-xl">
              {t.rich("lead", { strong: engineering })}
            </p>
            <p className={PARAGRAPH}>{t.rich("software", { strong: emphasis })}</p>
            <p className={PARAGRAPH}>{t.rich("tools", { strong: emphasis })}</p>
            <p className={PARAGRAPH}>{t.rich("ai", { strong: emphasis })}</p>
            <p className={PARAGRAPH}>{t.rich("next", { strong: emphasis })}</p>
          </div>

          <div className="mt-12 flex flex-col gap-6 border-t border-line-strong pt-8">
            {availability && (
              <StatusIndicator
                status="success"
                label={tHero("availability", { city: availability.city })}
              />
            )}
            <div className="flex flex-col gap-3 sm:flex-row">
              {cvHref && (
                <a
                  href={cvHref}
                  download={`Adam-Giszter-CV-${locale.toUpperCase()}.pdf`}
                  hrefLang={locale}
                  type="application/pdf"
                  className={buttonStyles({
                    variant: "primary",
                    size: "lg",
                    className: "justify-center",
                  })}
                >
                  <Download aria-hidden="true" className="size-4" />
                  {tCommon("downloadCv")}
                </a>
              )}
              <a
                href="#contact"
                className={buttonStyles({
                  variant: "secondary",
                  size: "lg",
                  className: "justify-center",
                })}
              >
                {t("contactCta")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
