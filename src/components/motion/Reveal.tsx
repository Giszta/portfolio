"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Warianty animacji (CSS w globals.css, atrybut data-reveal-variant):
 * - portrait: zdjęcie — wolne wygaszenie i delikatne „osiadanie” skali,
 * - stagger: dzieci wchodzą kolejno, sam kontener się nie chowa.
 * Bez wariantu: fade + przesunięcie o 12 px.
 */
export type RevealVariant = "portrait" | "stagger";

export interface RevealProps {
  children: ReactNode;
  delay?: number;
  variant?: RevealVariant;
  className?: string;
}

export function Reveal({ children, delay = 0, variant, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={isVisible ? "visible" : "hidden"}
      data-reveal-variant={variant}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
