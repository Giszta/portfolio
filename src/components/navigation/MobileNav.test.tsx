import { act, fireEvent, screen, within } from "@testing-library/react";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import en from "../../../messages/en.json";
import type { NavSection } from "@/content/navigation";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { MobileNav } from "./MobileNav";

vi.mock(
  "@/i18n/navigation",
  async () => (await import("@/test-utils/navigationMock")).navigationMock,
);

const original = {
  showModal: HTMLDialogElement.prototype.showModal,
  close: HTMLDialogElement.prototype.close,
};

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
});

afterAll(() => {
  HTMLDialogElement.prototype.showModal = original.showModal;
  HTMLDialogElement.prototype.close = original.close;
});

let onMediaChange: ((event: MediaQueryListEvent) => void) | undefined;

beforeEach(() => {
  onMediaChange = undefined;
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: false,
      addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
        onMediaChange = listener;
      },
      removeEventListener: vi.fn(),
    })),
  );
});

function renderMenu(active: NavSection | null = null) {
  renderWithIntl(<MobileNav active={active} />);
  const dialog = document.querySelector("dialog");
  if (!dialog) throw new Error("dialog not rendered");
  const trigger = screen.getByRole("button", { name: en.common.openMenu });
  return { dialog, trigger };
}

describe("MobileNav", () => {
  it("renders a collapsed button that controls the menu dialog", () => {
    const { dialog, trigger } = renderMenu();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-controls", dialog.id);
    expect(dialog.open).toBe(false);
  });

  it("opens the menu with the main navigation", () => {
    const { dialog, trigger } = renderMenu();
    fireEvent.click(trigger);
    expect(dialog.open).toBe(true);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(
      within(dialog).getByRole("navigation", { name: en.navigation.label }),
    ).toBeInTheDocument();
  });

  it("contains the language switcher", () => {
    const { dialog, trigger } = renderMenu();
    fireEvent.click(trigger);
    expect(
      within(dialog).getByRole("navigation", { name: en.navigation.languageSwitcher.label }),
    ).toBeInTheDocument();
  });

  it("closes with the close button", () => {
    const { dialog, trigger } = renderMenu();
    fireEvent.click(trigger);
    fireEvent.click(within(dialog).getByRole("button", { name: en.common.closeMenu }));
    expect(dialog.open).toBe(false);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("closes after choosing a section", () => {
    const { dialog, trigger } = renderMenu();
    fireEvent.click(trigger);
    fireEvent.click(within(dialog).getByRole("link", { name: en.navigation.contact }));
    expect(dialog.open).toBe(false);
  });

  it("stays in sync when the browser closes the dialog (e.g. Esc)", () => {
    const { dialog, trigger } = renderMenu();
    fireEvent.click(trigger);
    act(() => dialog.close());
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("marks the active section inside the menu", () => {
    const { dialog, trigger } = renderMenu("about");
    fireEvent.click(trigger);
    expect(within(dialog).getByRole("link", { name: en.navigation.about })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  it("closes when the viewport grows to the desktop layout", () => {
    const { dialog, trigger } = renderMenu();
    fireEvent.click(trigger);
    act(() => onMediaChange?.({ matches: true } as MediaQueryListEvent));
    expect(dialog.open).toBe(false);
  });
});
