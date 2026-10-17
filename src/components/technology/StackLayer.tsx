import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion";
import type { StackGroup } from "@/content/stack";
import { StackChip } from "./StackChip";

/** Odstęp między kolejnymi warstwami przy pojawianiu się (ms). */
const STAGGER_MS = 80;

interface StackLayerProps {
  group: StackGroup;
  index: number;
}

/**
 * Jedna warstwa „widoku rozstrzelonego": węzeł na osi, linia pomocnicza i płyta z chipami.
 * Od `lg` kolejne płyty są przesunięte o `--i` kroków; na telefonie wszystkie leżą w jednej kolumnie.
 */
export function StackLayer({ group, index }: StackLayerProps) {
  const t = useTranslations("technology");
  const titleId = `stack-${group.id}-title`;
  const number = String(index + 1).padStart(2, "0");

  return (
    <li
      style={{ "--i": index } as CSSProperties}
      className="relative mb-3.5 grid grid-cols-[1.5rem_1.25rem_minmax(0,1fr)] items-center last:mb-0 lg:grid-cols-[1.5rem_calc(var(--i)*2.25rem+3.5rem)_minmax(0,40rem)]"
    >
      <span
        aria-hidden="true"
        className="relative z-10 ml-[7px] size-[9px] rounded-full border border-cyan bg-canvas"
      />
      <span aria-hidden="true" className="h-px bg-linear-to-r from-line-strong to-cyan/70" />

      <Reveal
        delay={index * STAGGER_MS}
        className="border border-line-strong bg-canvas/80 px-4 py-4 sm:px-5 sm:py-[1.125rem]"
      >
        <div className="mb-3 flex items-baseline gap-3.5">
          <span
            aria-hidden="true"
            className="font-mono text-[0.8125rem] font-semibold tracking-widest text-cyan"
          >
            {number}
          </span>
          <h3 id={titleId} className="text-base font-semibold text-fg sm:text-lg">
            {t(`groups.${group.id}.title`)}
          </h3>
        </div>
        <ul aria-labelledby={titleId} className="flex flex-wrap gap-2">
          {group.items.map((item) => (
            <StackChip key={`${item.kind}:${item.id}`} item={item} view={group.view} />
          ))}
        </ul>
      </Reveal>
    </li>
  );
}
