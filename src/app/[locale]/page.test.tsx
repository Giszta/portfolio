import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import pl from "../../../messages/pl.json";
import HomePage from "./page";

describe("HomePage", () => {
  it.each([
    ["en", en, "Engineer who codes."],
    ["pl", pl, "Inżynier, który koduje."],
  ] as const)("renders the %s heading from translations", (locale, messages, heading) => {
    render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <HomePage />
      </NextIntlClientProvider>,
    );
    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
  });
});
