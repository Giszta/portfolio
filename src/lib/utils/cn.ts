import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display-xl", "display-lg", "display-md", "label"],
      shadow: ["glow", "glow-soft"],
      ease: ["standard", "emphasized"],
      animate: ["fade-in", "slide-up", "pulse-soft"],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
