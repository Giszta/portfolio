import { screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import en from "../../../messages/en.json";
import { NAV_SECTIONS, type NavSection } from "@/content/navigation";
import { siteConfig } from "@/content/site";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { SiteHeader } from "./SiteHeader";

const state = vi.hoisted(() => ({
  scrolled: false,
  active: null as NavSection | null,
}));

vi.mock("@/hooks/useScrolled", () => ({ useScrolled: () => state.scrolled }));
vi.mock("@/hooks/useActiveSection", () => ({ useActiveSection: () => state.active }));
vi.mock(
  "@/i18n/navigation",
  async () => (await import("@/test-utils/navigationMock")).navigationMock,
);
vi.mock("./MobileNav", () => ({ MobileNav: () => null }));

describe("SiteHeader", () => {
  beforeEach(() => {
    state.scrolled = false;
    state.active = null;
  });

  it("is the banner landmark", () => {
    renderWithIntl(<SiteHeader />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("links the wordmark to the home page", () => {
    renderWithIntl(<SiteHeader />);
    expect(screen.getByRole("link", { name: siteConfig.shortName })).toHaveAttribute("href", "/");
  });

  it("contains the main navigation with every section", () => {
    renderWithIntl(<SiteHeader />);
    const nav = screen.getByRole("navigation", { name: en.navigation.label });
    expect(within(nav).getAllByRole("link")).toHaveLength(NAV_SECTIONS.length);
  });

  it("highlights the section reported by the scroll spy", () => {
    state.active = "engineering";
    renderWithIntl(<SiteHeader />);
    expect(screen.getByRole("link", { name: en.navigation.engineering })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  it("is transparent at the top of the page", () => {
    renderWithIntl(<SiteHeader />);
    expect(screen.getByRole("banner")).not.toHaveAttribute("data-scrolled");
  });

  it("gets its background state after scrolling", () => {
    state.scrolled = true;
    renderWithIntl(<SiteHeader />);
    expect(screen.getByRole("banner")).toHaveAttribute("data-scrolled");
  });
});
