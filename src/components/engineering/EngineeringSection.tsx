import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion";
import { Container, Section, Tag } from "@/components/ui";
import { CapabilityList } from "./CapabilityList";

const HEADING_ID = "engineering-title";

const CHIPS = ["solidworks","solidedge","inventor","creo", "autocad", "draftsight", "kicad", "documentation", "custom"] as const;

export function EngineeringSection() {
  const t = useTranslations("engineering");

  return (
    <Section id="engineering" aria-labelledby={HEADING_ID}>
      <Container>
        <Reveal>
          <h2 id={HEADING_ID} className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-7">
            <span className="font-display text-[clamp(7rem,18vw,12.5rem)] leading-[0.82] font-semibold tracking-tight type-outline">
              {t("titleOutline")}
            </span>{" "}
            <span className="font-display text-display-md text-fg lg:pb-1.5">
              {t("titleSolid")}
            </span>
          </h2>

          {/* Linia pomiarowa: czysta dekoracja, znaczenie niesie nagłówek. */}
          <div
            aria-hidden="true"
            className="mt-9 flex items-center gap-3 font-mono text-xs font-medium tracking-widest text-cyan uppercase"
          >
            <span>{t("measure.start")}</span>
            <span className="relative h-px flex-1 bg-cyan/60 before:absolute before:top-[-5px] before:left-0 before:h-[11px] before:w-px before:bg-cyan after:absolute after:top-[-5px] after:right-0 after:h-[11px] after:w-px after:bg-cyan" />
            <span>{t("measure.end")}</span>
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-9 grid gap-8 lg:grid-cols-2 lg:gap-16">
          <p className="max-w-[46ch] text-base leading-relaxed text-fg lg:text-lg">{t("lead")}</p>
          {/* Tag jest zwykłym <span>, więc każdy chip dostaje własne <li>. */}
          <ul aria-label={t("chipsLabel")} className="flex flex-wrap content-start gap-2">
            {CHIPS.map((key) => (
              <li key={key}>
                <Tag view="engineering">{t(`chips.${key}`)}</Tag>
              </li>
            ))}
          </ul>
        </Reveal>

        <CapabilityList />
      </Container>
    </Section>
  );
}
