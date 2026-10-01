import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import en from "../../../messages/en.json";
import { NAV_SECTIONS } from "@/content/navigation";
import { siteConfig } from "@/content/site";
import { getSocialLinks } from "@/lib/social";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { SiteFooter } from "./SiteFooter";

vi.mock(
  "@/i18n/navigation",
  async () => (await import("@/test-utils/navigationMock")).navigationMock,
);

describe("SiteFooter", () => {
  it("is the contentinfo landmark", () => {
    renderWithIntl(<SiteFooter />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("shows the name and the tagline", () => {
    renderWithIntl(<SiteFooter />);
    expect(screen.getByText(siteConfig.name)).toBeInTheDocument();
    expect(screen.getByText(en.footer.tagline)).toBeInTheDocument();
  });

  it("shows the copyright with the current year", () => {
    renderWithIntl(<SiteFooter />);
    const year = new Date().getFullYear();
    expect(screen.getByText(`© ${year} ${siteConfig.name}`)).toBeInTheDocument();
  });

  it("repeats the section navigation under its own label", () => {
    renderWithIntl(<SiteFooter />);
    const nav = screen.getByRole("navigation", { name: en.footer.navLabel });
    expect(within(nav).getAllByRole("link")).toHaveLength(NAV_SECTIONS.length);
  });

  it("lists every configured contact channel", () => {
    renderWithIntl(<SiteFooter />);
    const nav = screen.getByRole("navigation", { name: en.footer.socialLabel });
    expect(within(nav).getAllByRole("link")).toHaveLength(getSocialLinks(siteConfig.links).length);
    expect(within(nav).getByRole("link", { name: en.footer.github })).toHaveAttribute(
      "href",
      siteConfig.links.github,
    );
  });

  it("labels its language switcher differently from the header one", () => {
    renderWithIntl(<SiteFooter />);
    expect(screen.getByRole("navigation", { name: en.footer.languageLabel })).toBeInTheDocument();
  });

  it("links back to the main content", () => {
    renderWithIntl(<SiteFooter />);
    expect(screen.getByRole("link", { name: en.footer.backToTop })).toHaveAttribute(
      "href",
      "#main-content",
    );
  });
});
