import { useTranslations } from "next-intl";

interface SkipLinkProps {
  targetId?: string;
}

export function SkipLink({ targetId = "main-content" }: SkipLinkProps) {
  const t = useTranslations("common");

  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-sm focus:bg-accent focus:px-4 focus:py-3 focus:font-medium focus:text-accent-contrast"
    >
      {t("skipToContent")}
    </a>
  );
}
