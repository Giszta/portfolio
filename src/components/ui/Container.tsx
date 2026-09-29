import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type ContainerSize = "narrow" | "default" | "wide";

const sizes: Record<ContainerSize, string> = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
};

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
}

export function Container({ size = "default", className, ...props }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizes[size], className)} {...props} />
  );
}
