import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { CvLink } from "@/components/cv";
import { Reveal } from "@/components/motion";
import { CutLabel, CutLine, StatusIndicator, formatCutMark } from "@/components/technical";
import { Section, buttonStyles } from "@/components/ui";
import { siteConfig, type SiteConfig } from "@/content/site";
import { AboutPortrait } from "./AboutPortrait";

const HEADING_ID = "about-title";

/** Hero ma przekrój A–A, projekty i About mają B–B. */
const CUT_LETTER = "B";

const PARAGRAPH = "max-w-[64ch] text-[0.9375rem] leading-7 text-fg-secondary";

const engineering = (chunks: ReactNode) => (
  <strong className="font-semibold text-view-engineering">{chunks}</strong>
);

const emphasis = (chunks: ReactNode) => <strong className="font-semibold text-fg">{chunks}</strong>;

export function AboutSection() {
  const t = useTranslations("about");
  const tHero = useTranslations("hero");
  const tCommon = useTranslations("common");
  const { availability }: Pick<SiteConfig, "availability"> = siteConfig;

  return (
    <Section id="about" aria-labelledby={HEADING_ID} spacing="none">
      <div className="relative grid lg:grid-cols-[46fr_54fr]">
        <AboutPortrait className="h-80 sm:h-96 lg:h-auto lg:min-h-220" />

        {/* Desktop: linia cięcia na granicy kolumn (46%), strzałki patrzą na zdjęcie. */}
        <CutLine
          orientation="vertical"
          mark={CUT_LETTER}
          className="absolute inset-y-0 left-[46%] hidden -translate-x-1/2 py-6 lg:flex"
        />

        <div className="px-4 py-12 sm:px-6 sm:py-16 lg:py-24 lg:pr-[max(2rem,calc((100vw_-_72rem)/2_+_2rem))] lg:pl-18">
          {/* Telefon: ta sama linia poziomo, między zdjęciem a tekstem. */}
          <CutLine orientation="horizontal" mark={CUT_LETTER} className="mb-8 lg:hidden" />

          <Reveal>
            <div aria-hidden="true" className="mb-6">
              <CutLabel code={formatCutMark(CUT_LETTER)} label={t("cutLabel")} />
            </div>

            <h2
              id={HEADING_ID}
              className="max-w-[20ch] font-display text-display-md text-balance text-fg"
            >
              {t("title")}
            </h2>
          </Reveal>

          <Reveal variant="stagger" className="mt-10 flex flex-col gap-6">
            <p className="max-w-[46ch] text-base leading-relaxed text-fg lg:text-lg">
              {t.rich("lead", { strong: engineering })}
            </p>
            <p className={PARAGRAPH}>{t.rich("software", { strong: emphasis })}</p>
            <p className={PARAGRAPH}>{t.rich("tools", { strong: emphasis })}</p>
            <p className={PARAGRAPH}>{t.rich("ai", { strong: emphasis })}</p>
            <p className={PARAGRAPH}>{t.rich("next", { strong: emphasis })}</p>
          </Reveal>

          <Reveal
            delay={200}
            className="mt-12 flex flex-col gap-6 border-t border-line-strong pt-8"
          >
            {availability && (
              <StatusIndicator
                status="success"
                label={tHero("availability", { city: availability.city })}
              />
            )}
            <div className="flex flex-col gap-3 sm:flex-row">
              <CvLink
                className={buttonStyles({
                  variant: "primary",
                  size: "lg",
                  className: "justify-center",
                })}
              >
                <Download aria-hidden="true" className="size-4" />
                {tCommon("downloadCv")}
              </CvLink>
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
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
