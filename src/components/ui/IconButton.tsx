import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { buttonStyles, type ButtonVariant } from "./Button";

export type IconButtonSize = "sm" | "md";

const sizes: Record<IconButtonSize, string> = {
  sm: "size-8 p-0",
  md: "size-10 p-0",
};

export interface IconButtonProps extends Omit<
  ComponentPropsWithRef<"button">,
  "children" | "aria-label"
> {
  label: string;
  icon: ReactNode;
  variant?: ButtonVariant;
  size?: IconButtonSize;
}

export function IconButton({
  label,
  icon,
  variant = "ghost",
  size = "md",
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={buttonStyles({ variant, className: cn(sizes[size], className) })}
      {...props}
    >
      <span aria-hidden="true" className="inline-flex [&>svg]:size-4">
        {icon}
      </span>
    </button>
  );
}
