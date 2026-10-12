"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils/cn";

export interface FolderItem {
  id: string;
  tab: ReactNode;
  panel: ReactNode;
}

interface ProjectFolderProps {
  items: readonly FolderItem[];
  labels: { tablist: string; previous: string; next: string };
}

interface Transition {
  from: number;
  to: number;
  direction: 1 | -1;
}


const GHOST_OFFSETS = [
  "translate-x-6 translate-y-6",
  "translate-x-4 translate-y-4",
  "translate-x-2 translate-y-2",
];

const CUT_ANIMATION: KeyframeAnimationOptions = {
  duration: 700,
  easing: "cubic-bezier(0.65, 0, 0.35, 1)",
};

/** Oznaczenie przekroju wg ISO 128-40 — symbol rysunkowy, identyczny w każdym języku, więc nie trafia do tłumaczeń. */
const CUT_MARK = "B";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function canAnimate(): boolean {
  const reducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return !reducedMotion && typeof HTMLElement.prototype.animate === "function";
}

export function ProjectFolder({ items, labels }: ProjectFolderProps) {
  const [active, setActive] = useState(0);
  const [transition, setTransition] = useState<Transition | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cutRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const count = items.length;
  const ghosts = GHOST_OFFSETS.slice(
    GHOST_OFFSETS.length - Math.min(GHOST_OFFSETS.length, count - 1),
  );

  const tabId = (id: string) => `${baseId}-tab-${id}`;
  const panelId = (id: string) => `${baseId}-panel-${id}`;

  useLayoutEffect(() => {
    if (!transition) return;
    const panel = panelRefs.current[transition.to];
    const cut = cutRef.current;
    if (!panel || !cut) return;

    const forward = transition.direction === 1;
    const reveal = panel.animate(
      { clipPath: [forward ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)", "inset(0 0 0 0)"] },
      CUT_ANIMATION,
    );
    const sweep = cut.animate(
      {
        transform: forward
          ? ["translateX(0%)", "translateX(100%)"]
          : ["translateX(100%)", "translateX(0%)"],
        opacity: [1, 1, 0],
      },
      CUT_ANIMATION,
    );

    let current = true;
    Promise.all([reveal.finished, sweep.finished]).then(
      () => {
        if (current) setTransition(null);
      },
      () => {},
    );

    return () => {
      current = false;
      reveal.cancel();
      sweep.cancel();
    };
  }, [transition]);

  function select(requested: number, { focus = false } = {}) {
    const next = (requested + count) % count;
    const tab = tabRefs.current[next];
    if (focus) tab?.focus();
    tab?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
    if (next === active) return;

    setTransition(
      canAnimate() ? { from: active, to: next, direction: requested > active ? 1 : -1 } : null,
    );
    setActive(next);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const targets: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: count - 1,
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    select(target, { focus: true });
  }

  return (
    <div className="mt-10 grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-0">
      <div
        role="tablist"
        aria-label={labels.tablist}
        className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pt-6 lg:pb-0"
      >
        {items.map((item, index) => (
          <button
            key={item.id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={tabId(item.id)}
            aria-selected={index === active}
            aria-controls={panelId(item.id)}
            tabIndex={index === active ? 0 : -1}
            onClick={() => select(index)}
            onKeyDown={onKeyDown}
            className={`min-w-44 shrink-0 border border-line bg-surface px-4 py-3 text-left text-fg-secondary transition-colors hover:text-fg aria-selected:bg-card aria-selected:text-fg aria-selected:shadow-[inset_0_-2px_0_var(--color-cyan)] lg:-mr-px lg:min-w-0 lg:border-r-0 lg:aria-selected:shadow-[inset_3px_0_0_var(--color-cyan)] ${focusRing}`}
          >
            {item.tab}
          </button>
        ))}
      </div>

      <div className="relative isolate">
        {ghosts.map((offset) => (
          <span
            key={offset}
            aria-hidden="true"
            className={`absolute inset-0 hidden border border-line bg-surface lg:block ${offset}`}
          />
        ))}

        <div className="relative grid overflow-x-clip">
          {items.map((item, index) => {
            const visible = index === active || index === transition?.from;
            return (
              <div
                key={item.id}
                ref={(element) => {
                  panelRefs.current[index] = element;
                }}
                role="tabpanel"
                id={panelId(item.id)}
                aria-labelledby={tabId(item.id)}
                hidden={!visible}
                className={cn("relative [grid-area:1/1]", index === active && "z-10")}
              >
                {item.panel}
              </div>
            );
          })}

          <div
            ref={cutRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 opacity-0"
          >
            <span className="absolute inset-y-0 left-0 border-l-[1.5px] border-dashed border-amber" />
            <span className="absolute top-1 left-0 -translate-x-1/2 bg-card px-1 font-mono text-xs font-bold text-amber">
              {CUT_MARK}
            </span>
            <span className="absolute bottom-1 left-0 -translate-x-1/2 bg-card px-1 font-mono text-xs font-bold text-amber">
              {CUT_MARK}
            </span>
          </div>
        </div>

        <div className="relative mt-4 flex justify-end gap-2">
          <button
            type="button"
            aria-label={labels.previous}
            onClick={() => select(active - 1)}
            className={`grid size-11 place-items-center border border-line bg-surface text-fg-secondary transition-colors hover:text-fg ${focusRing}`}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
          </button>
          <button
            type="button"
            aria-label={labels.next}
            onClick={() => select(active + 1)}
            className={`grid size-11 place-items-center border border-line bg-surface text-fg-secondary transition-colors hover:text-fg ${focusRing}`}
          >
            <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}