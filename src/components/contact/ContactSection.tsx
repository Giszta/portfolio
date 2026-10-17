import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion";
import { Container, Section } from "@/components/ui";
import { StatusIndicator } from "@/components/technical";
import { siteConfig, type SiteConfig } from "@/content/site";
import type { ContactAction } from "@/lib/contact";
import { ContactForm } from "./ContactForm";
import { ContactLinks } from "./ContactLinks";

const HEADING_ID = "contact-title";

interface ContactSectionProps {
  action: ContactAction;
}

export function ContactSection({ action }: ContactSectionProps) {
  const t = useTranslations("contact");
  const tHero = useTranslations("hero");
  const { availability, links }: Pick<SiteConfig, "availability" | "links"> = siteConfig;

  return (
    <Section id="contact" aria-labelledby={HEADING_ID}>
      <Container className="grid items-start gap-12 lg:grid-cols-[5fr_6fr] lg:gap-16">
        <Reveal className="flex flex-col gap-6">
          <h2 id={HEADING_ID} className="max-w-[14ch] font-display text-display-md text-fg">
            <span className="block type-outline">{t("titleOutline")}</span>{" "}
            <span className="block">{t("titleSolid")}</span>
          </h2>
          <p className="max-w-[44ch] text-base leading-relaxed text-fg-secondary lg:text-lg">
            {t("lead")}
          </p>

          {links.email && (
            <a
              href={`mailto:${links.email}`}
              className="w-fit font-mono text-xl font-semibold tracking-tight break-all text-cyan hover:underline"
            >
              {links.email}
            </a>
          )}
          {availability && (
            <StatusIndicator
              status="success"
              label={tHero("availability", { city: availability.city })}
            />
          )}

          <ContactLinks />
        </Reveal>

        <Reveal delay={100}>
          <ContactForm action={action} />
        </Reveal>
      </Container>
    </Section>
  );
}
