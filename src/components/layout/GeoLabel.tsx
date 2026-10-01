import { useLocale, useTranslations } from "next-intl";
import { siteConfig } from "@/content/site";
import { formatGeo } from "@/lib/geo";
import { cn } from "@/lib/utils/cn";

const SEPARATOR = "//";

interface GeoLabelProps {
  className?: string;
}

export function GeoLabel({ className }: GeoLabelProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const { countryCode, latitude, longitude } = siteConfig.location;
  const country =
    new Intl.DisplayNames([locale], { type: "region" }).of(countryCode) ?? countryCode;

  return (
    <p className={cn("font-mono text-label tracking-widest text-fg-muted uppercase", className)}>
      <span aria-hidden="true">
        {countryCode} <span className="text-line-strong">{SEPARATOR}</span>{" "}
        {formatGeo(latitude, longitude)}
      </span>
      <span className="sr-only">{t("location", { country })}</span>
    </p>
  );
}
