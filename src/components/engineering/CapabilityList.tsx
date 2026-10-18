import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion";

const CAPABILITIES = ["design", "documentation", "production", "client"] as const;

/** Odstęp między kolejnymi pozycjami przy pojawianiu się (ms). */
const STAGGER_MS = 100;

export function CapabilityList() {
  const t = useTranslations("engineering");

  return (
    <ol
      aria-label={t("capabilitiesLabel")}
      className="mt-14 grid border border-line-strong bg-surface/60 sm:mt-16 sm:grid-cols-2"
    >
      {CAPABILITIES.map((key, index) => (
        <li
          key={key}
          className="border-b border-line px-5 last:border-b-0 sm:px-8 sm:even:border-l sm:nth-[n+3]:border-b-0"
        >
          <Reveal
            delay={index * STAGGER_MS}
            className="grid grid-cols-[3.5rem_1fr] gap-x-2 py-6 sm:grid-cols-[4.5rem_1fr] sm:py-8"
          >
            <span
              aria-hidden="true"
              className="font-mono text-3xl leading-none font-semibold tracking-tighter text-line-strong sm:text-[2.5rem]"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-fg">
                {t(`capabilities.${key}.title`)}
              </h3>
              <p className="max-w-[34ch] text-[0.9375rem] leading-7 text-fg-secondary">
                {t(`capabilities.${key}.text`)}
              </p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
