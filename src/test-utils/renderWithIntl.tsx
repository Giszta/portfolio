import { render, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider, type Locale } from "next-intl";
import type { ReactElement, ReactNode } from "react";
import en from "../../messages/en.json";
import pl from "../../messages/pl.json";

const MESSAGES = { en, pl } as const satisfies Record<Locale, typeof en>;

interface IntlRenderOptions extends Omit<RenderOptions, "wrapper"> {
  locale?: Locale;
}

export function renderWithIntl(
  ui: ReactElement,
  { locale = "en", ...options }: IntlRenderOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]}>
        {children}
      </NextIntlClientProvider>
    );
  }
  return render(ui, { wrapper: Wrapper, ...options });
}
