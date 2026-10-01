import type { ComponentProps } from "react";

type Href = string | { pathname: string; hash?: string };

type MockLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: Href;
  locale?: string;
  scroll?: boolean;
};

function toHref(href: Href): string {
  if (typeof href === "string") return href;
  return href.hash ? `${href.pathname}#${href.hash}` : href.pathname;
}

function MockLink({ href, locale: _locale, scroll: _scroll, children, ...props }: MockLinkProps) {
  return (
    <a href={toHref(href)} {...props}>
      {children}
    </a>
  );
}

export const navigationMock = {
  Link: MockLink,
  usePathname: () => "/",
};
