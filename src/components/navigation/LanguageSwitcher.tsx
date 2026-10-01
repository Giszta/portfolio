"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils/cn";

export interface LanguageSwitcherProps {
  className?: string;
  label?: string;
}

export function LanguageSwitcher({ className, label }: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("navigation");

  return (
    <nav aria-label={label ?? t("languageSwitcher.label")} className={className}>
      <ul className="flex rounded-sm border border-line font-mono text-label">
        {routing.locales.map((target) => {
          const isCurrent = target === locale;
          const name = t(`languages.${target}`);

          return (
            <li key={target}>
              <Link
                href={pathname}
                locale={target}
                hrefLang={target}
                scroll={false}
                aria-current={isCurrent ? "true" : undefined}
                title={isCurrent ? undefined : t("languageSwitcher.switchTo", { language: name })}
                className={cn(
                  "inline-flex size-11 items-center justify-center uppercase",
                  "transition-colors duration-200 ease-standard",
                  isCurrent ? "bg-surface-raised text-fg" : "text-fg-muted hover:text-fg",
                )}
              >
                <span aria-hidden="true">{target}</span>
                <span className="sr-only" lang={target}>
                  {name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
