import type { AnchorHTMLAttributes, ReactNode } from "react";
import { render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";
import en from "../../../messages/en.json";
import pl from "../../../messages/pl.json";
import { LanguageSwitcher } from "./LanguageSwitcher";

const { usePathnameMock } = vi.hoisted(() => ({
  usePathnameMock: vi.fn(() => "/"),
}));

type MockLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  locale: string;
  scroll?: boolean;
  children: ReactNode;
};

// Zamiast prawdziwej nawigacji Next.js: ta sama logika prefiksu, bez routera.
vi.mock("@/i18n/navigation", () => ({
  usePathname: usePathnameMock,
  Link: ({ href, locale, scroll: _scroll, children, ...props }: MockLinkProps) => (
    <a href={href === "/" ? `/${locale}` : `/${locale}${href}`} {...props}>
      {children}
    </a>
  ),
}));

function renderSwitcher(locale: "pl" | "en") {
  const messages = locale === "pl" ? pl : en;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LanguageSwitcher />
    </NextIntlClientProvider>,
  );
}

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    usePathnameMock.mockReturnValue("/");
  });

  it("is a labelled navigation landmark", () => {
    renderSwitcher("en");
    expect(screen.getByRole("navigation", { name: "Language" })).toBeInTheDocument();
  });

  it("marks the current language", () => {
    renderSwitcher("en");
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("link", { name: "Polski" })).not.toHaveAttribute("aria-current");
  });

  it("keeps the current page when switching language", () => {
    usePathnameMock.mockReturnValue("/design-system");
    renderSwitcher("en");
    expect(screen.getByRole("link", { name: "Polski" })).toHaveAttribute(
      "href",
      "/pl/design-system",
    );
  });

  it("keeps the project slug when switching language", () => {
    usePathnameMock.mockReturnValue("/projects/forge");
    renderSwitcher("pl");
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
      "href",
      "/en/projects/forge",
    );
  });

  it("links the home page to the other locale root", () => {
    renderSwitcher("pl");
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en");
  });

  it("announces each language name in its own language", () => {
    renderSwitcher("en");
    const polish = screen.getByRole("link", { name: "Polski" });
    expect(within(polish).getByText("Polski")).toHaveAttribute("lang", "pl");
    expect(polish).toHaveAttribute("hrefLang", "pl");
  });

  it("explains the action in a tooltip only for the other language", () => {
    renderSwitcher("pl");
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
      "title",
      "Zmień język na English",
    );
    expect(screen.getByRole("link", { name: "Polski" })).not.toHaveAttribute("title");
  });

  it("is reachable with the keyboard", () => {
    renderSwitcher("en");
    const link = screen.getByRole("link", { name: "Polski" });
    link.focus();
    expect(link).toHaveFocus();
  });

  it("renders every language with a fixed size (no layout shift)", () => {
    renderSwitcher("en");
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    links.forEach((link) => expect(link).toHaveClass("size-11"));
  });
});
