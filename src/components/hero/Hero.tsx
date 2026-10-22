import { ArrowDown, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { CvLink } from "@/components/cv";
import { Container, Section, buttonStyles } from "@/components/ui";
import { siteConfig, type SiteConfig } from "@/content/site";
import { heroEnter } from "./enter";
import { ShaftCut } from "./ShaftCut";
import { ShaftCutMobile } from "./ShaftCutMobile";

const HEADING_ID = "home-title";

export function Hero() {
  const t = useTranslations("hero");
  const tCommon = useTranslations("common");
  const { availability }: Pick<SiteConfig, "availability"> = siteConfig;
  const title = [t("titleOutline"), t("titleSolid")].join(" ");

  return (
    <Section id="home" aria-labelledby={HEADING_ID} className="pt-12 sm:pt-16">
      <Container className="flex flex-col items-center gap-8 text-center">
        {availability && (
          <p
            {...heroEnter(0)}
            className="max-w-md font-mono text-label tracking-widest text-balance text-fg-secondary uppercase sm:max-w-none"
          >
            <span
              aria-hidden="true"
              className="mr-2 inline-block size-2 rounded-full bg-success align-middle"
            />
            {t("availability", { city: availability.city })}
          </p>
        )}

        <h1
          id={HEADING_ID}
          {...heroEnter(1)}
          className="w-full font-display text-display-xl text-fg"
        >
          <span className="sr-only">{title}</span>
          <span aria-hidden="true" className="flex justify-center lg:gap-5">
            <span className="type-outline">{t("titleOutline")}</span>
            <span>{t("titleSolid")}</span>
          </span>
        </h1>

        <p {...heroEnter(2, "rise")} className="max-w-2xl text-lg text-fg-secondary">
          {t("lead", { name: siteConfig.name })}
        </p>

        <div
          {...heroEnter(3)}
          className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center"
        >
          <a
            href="#projects"
            className={buttonStyles({
              variant: "primary",
              size: "lg",
              className: "justify-center",
            })}
          >
            {t("ctaPrimary")}
            <ArrowDown aria-hidden="true" className="size-4" />
          </a>
          <CvLink
            className={buttonStyles({
              variant: "secondary",
              size: "lg",
              className: "justify-center",
            })}
          >
            <Download aria-hidden="true" className="size-4" />
            {tCommon("downloadCv")}
            <span className="font-mono text-label text-fg-muted">{t("cvFormat")}</span>
          </CvLink>
        </div>

        <div {...heroEnter(4)} className="w-full">
          <ShaftCut className="hidden lg:block" />
          <ShaftCutMobile className="lg:hidden" />
          <p className="mt-4 hidden font-mono text-label tracking-widest text-fg-muted uppercase lg:block">
            {t("dragHint")}
          </p>
        </div>
      </Container>
    </Section>
  );
}
