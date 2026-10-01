import { useTranslations } from "next-intl";
import { NAV_SECTIONS, type NavSection } from "@/content/navigation";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

export type NavLinksVariant = "header" | "menu" | "footer";

interface NavLinksProps {
  variant: NavLinksVariant;
  active?: NavSection | null;
  onNavigate?: () => void;
  className?: string;
}

const styles: Record<NavLinksVariant, { list: string; item: string; link: string }> = {
  header: {
    list: "flex items-center gap-1",
    item: "",
    link: cn(
      "relative inline-flex h-11 items-center px-3 text-sm text-fg-secondary transition-colors hover:text-fg",
      "after:absolute after:inset-x-3 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:ease-standard",
      "aria-[current=location]:text-fg aria-[current=location]:after:scale-x-100",
    ),
  },
  menu: {
    list: "flex flex-col",
    item: "motion-safe:animate-slide-up [animation-fill-mode:both]",
    link: "flex items-baseline gap-4 border-b border-line py-4 font-display text-display-md text-fg-secondary transition-colors hover:text-fg aria-[current=location]:text-fg",
  },
  footer: {
    list: "flex flex-col gap-2",
    item: "",
    link: "text-sm text-fg-secondary transition-colors hover:text-fg",
  },
};

function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function NavLinks({ variant, active = null, onNavigate, className }: NavLinksProps) {
  const t = useTranslations("navigation");
  const style = styles[variant];

  return (
    <ul className={cn(style.list, className)}>
      {NAV_SECTIONS.map((section, index) => (
        <li
          key={section}
          className={style.item}
          style={variant === "menu" ? { animationDelay: `${index * 40}ms` } : undefined}
        >
          <Link
            href={{ pathname: "/", hash: section }}
            aria-current={section === active ? "location" : undefined}
            onClick={onNavigate}
            className={style.link}
          >
            {variant === "menu" && (
              <span aria-hidden="true" className="font-mono text-label text-fg-muted">
                {formatIndex(index)}
              </span>
            )}
            {t(section)}
          </Link>
        </li>
      ))}
    </ul>
  );
}
