"use client";

import { useTranslations } from "next-intl";
import { GeoLabel } from "@/components/layout";
import { Container } from "@/components/ui";
import { NAV_SECTIONS } from "@/content/navigation";
import { siteConfig } from "@/content/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrolled } from "@/hooks/useScrolled";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";

export function SiteHeader() {
  const t = useTranslations("navigation");
  const scrolled = useScrolled();
  const active = useActiveSection(NAV_SECTIONS);

  return (
    <header
      data-scrolled={scrolled || undefined}
      className="sticky inset-x-0 top-0 z-40 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-300 ease-standard data-scrolled:border-line data-scrolled:bg-canvas/80 data-scrolled:backdrop-blur-md motion-safe:animate-fade-in"
    >
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight text-fg">
          {siteConfig.shortName}
        </Link>

        <nav aria-label={t("label")} className="hidden lg:block">
          <NavLinks variant="header" active={active} />
        </nav>

        <div className="flex items-center gap-4">
          <GeoLabel className="hidden xl:block" />
          <LanguageSwitcher className="hidden lg:block" />
          <MobileNav active={active} className="lg:hidden" />
        </div>
      </Container>
    </header>
  );
}
