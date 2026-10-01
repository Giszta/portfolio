"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { GeoLabel } from "@/components/layout";
import { IconButton } from "@/components/ui";
import type { NavSection } from "@/content/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NavLinks } from "./NavLinks";
import { cn } from "@/lib/utils/cn";

export const DESKTOP_QUERY = "(min-width: 64rem)";

interface MobileNavProps {
  active: NavSection | null;
  className?: string;
}

export function MobileNav({ active, className }: MobileNavProps) {
  const t = useTranslations();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuId = useId();
  const [open, setOpen] = useState(false);

  const openMenu = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };

  const closeMenu = () => dialogRef.current?.close();

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) dialogRef.current?.close();
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <IconButton
        label={t("common.openMenu")}
        icon={<Menu />}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={openMenu}
        className={cn("size-11", className)}
      />

      <dialog
        ref={dialogRef}
        id={menuId}
        aria-label={t("navigation.menu")}
        onClose={() => setOpen(false)}
        className={cn(
          "m-0 h-dvh max-h-none w-full max-w-none flex-col bg-canvas p-0 text-fg backdrop:bg-canvas/80 open:flex",
          "transition-[opacity,translate,display,overlay] transition-discrete duration-300 ease-standard",
          "-translate-y-2 opacity-0 open:translate-y-0 open:opacity-100",
          "starting:open:-translate-y-2 starting:open:opacity-0",
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
          <GeoLabel />
          <IconButton
            label={t("common.closeMenu")}
            icon={<X />}
            onClick={closeMenu}
            className="size-11"
          />
        </div>

        <nav aria-label={t("navigation.label")} className="flex-1 overflow-y-auto px-4 py-6">
          <NavLinks variant="menu" active={active} onNavigate={closeMenu} />
        </nav>

        <div className="flex border-t border-line px-4 py-4">
          <LanguageSwitcher />
        </div>
      </dialog>
    </>
  );
}
