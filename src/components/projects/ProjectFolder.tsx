"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export interface FolderItem {
  id: string;
  tab: ReactNode;
  panel: ReactNode;
}

interface ProjectFolderProps {
  items: readonly FolderItem[];
  labels: { tablist: string; previous: string; next: string };
}

const GHOST_OFFSETS = ["translate-x-6 translate-y-6", "translate-x-4 translate-y-4", "translate-x-2 translate-y-2"];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function ProjectFolder({ items, labels }: ProjectFolderProps) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const count = items.length;
  const ghosts = GHOST_OFFSETS.slice(GHOST_OFFSETS.length - Math.min(GHOST_OFFSETS.length, count - 1));

  const tabId = (id: string) => `${baseId}-tab-${id}`;
  const panelId = (id: string) => `${baseId}-panel-${id}`;

  function select(index: number, { focus = false } = {}) {
    const next = (index + count) % count;
    setActive(next);
    const tab = tabRefs.current[next];
    if (focus) tab?.focus();
    tab?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
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

        {items.map((item, index) => (
          <div
            key={item.id}
            role="tabpanel"
            id={panelId(item.id)}
            aria-labelledby={tabId(item.id)}
            hidden={index !== active}
            className="relative transition-opacity duration-300 transition-discrete starting:opacity-0 motion-reduce:transition-none"
          >
            {item.panel}
          </div>
        ))}

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