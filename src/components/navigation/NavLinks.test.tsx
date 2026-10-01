import { fireEvent, screen, within } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import en from "../../../messages/en.json";
import { NAV_SECTIONS } from "@/content/navigation";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { NavLinks } from "./NavLinks";

type MockLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string | { pathname: string; hash?: string };
};

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: MockLinkProps) => (
    <a href={typeof href === "string" ? href : `${href.pathname}#${href.hash ?? ""}`} {...props}>
      {children}
    </a>
  ),
}));

describe("NavLinks", () => {
  it("renders one translated link per section, in page order", () => {
    renderWithIntl(<NavLinks variant="header" />);
    const names = screen.getAllByRole("link").map((link) => link.textContent);
    expect(names).toEqual(NAV_SECTIONS.map((section) => en.navigation[section]));
  });

  it("links to sections of the home page", () => {
    renderWithIntl(<NavLinks variant="header" />);
    expect(screen.getByRole("link", { name: en.navigation.about })).toHaveAttribute(
      "href",
      "/#about",
    );
  });

  it("marks only the active section as the current location", () => {
    renderWithIntl(<NavLinks variant="header" active="projects" />);
    expect(screen.getByRole("link", { name: en.navigation.projects })).toHaveAttribute(
      "aria-current",
      "location",
    );
    const others = screen.getAllByRole("link").filter((link) => link.hasAttribute("aria-current"));
    expect(others).toHaveLength(1);
  });

  it("has no current link before the first measurement", () => {
    renderWithIntl(<NavLinks variant="header" active={null} />);
    for (const link of screen.getAllByRole("link")) {
      expect(link).not.toHaveAttribute("aria-current");
    }
  });

  it("calls onNavigate when a link is clicked", () => {
    const onNavigate = vi.fn();
    renderWithIntl(<NavLinks variant="menu" onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("link", { name: en.navigation.contact }));
    expect(onNavigate).toHaveBeenCalledOnce();
  });

  it("keeps decorative indices out of the accessible name in the menu variant", () => {
    renderWithIntl(<NavLinks variant="menu" />);
    const about = screen.getByRole("link", { name: en.navigation.about });
    expect(within(about).getByText("02")).toHaveAttribute("aria-hidden", "true");
  });

  it("staggers menu items and leaves other variants static", () => {
    const { unmount } = renderWithIntl(<NavLinks variant="menu" />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveStyle({ animationDelay: "0ms" });
    expect(items[2]).toHaveStyle({ animationDelay: "80ms" });
    unmount();

    renderWithIntl(<NavLinks variant="header" />);
    expect(screen.getAllByRole("listitem")[2]).not.toHaveAttribute("style");
  });
});
