import { useEffect, useState } from "react";

export const ACTIVATION_LINE = "-45% 0px -55% 0px";

export function useActiveSection<T extends string>(ids: readonly T[]): T | null {
  const [active, setActive] = useState<T | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = ids.find((candidate) => candidate === entry.target.id);
          if (id) setActive(id);
        }
      },
      { rootMargin: ACTIVATION_LINE, threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
