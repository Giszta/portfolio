import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion";
import { Container, Section } from "@/components/ui";
import { STACK } from "@/content/stack";
import { StackLayer } from "./StackLayer";

const HEADING_ID = "technology-title";

export function TechnologySection() {
  const t = useTranslations("technology");

  return (
    <Section id="technology" tone="surface" aria-labelledby={HEADING_ID}>
      <Container>
        <Reveal>
          <h2 id={HEADING_ID} className="max-w-[14ch] font-display text-display-md text-fg">
            <span className="block">{t("titleSolid")}</span>{" "}
            <span className="block type-outline">{t("titleOutline")}</span>
          </h2>
          <p className="mt-5 max-w-[48ch] text-base leading-relaxed text-fg-secondary lg:text-lg">
            {t("lead")}
          </p>

          {/* Legenda stylu chipów — dekoracja, bo każda warstwa ma własny, nazwany nagłówek. */}
          <ul
            aria-hidden="true"
            className="mt-7 flex gap-5 font-mono text-[0.6875rem] tracking-widest text-fg-muted uppercase"
          >
            <li className="flex items-center gap-2">
              <span className="w-[18px] border-t border-line-strong" />
              {t("software")}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-[18px] border-t border-dashed border-cyan" />
              {t("engineering")}
            </li>
          </ul>
        </Reveal>

        <ol
          aria-label={t("groupsLabel")}
          className="relative mt-14 before:absolute before:inset-y-3 before:left-[11px] before:border-l before:border-dashed before:border-line-strong"
        >
          {STACK.map((group, index) => (
            <StackLayer key={group.id} group={group} index={index} />
          ))}
        </ol>
      </Container>
    </Section>
  );
}
