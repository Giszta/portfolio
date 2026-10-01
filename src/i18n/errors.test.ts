import { createTranslator, IntlError, IntlErrorCode } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import en from "../../messages/en.json";
import { getMessageFallback, onIntlError } from "./errors";

describe("translation lookup", () => {
  it("resolves a nested key", () => {
    const t = createTranslator({ locale: "en", messages: en, namespace: "hero" });
    expect(t("titleSolid")).toBe("who codes.");
  });

  it("interpolates ICU arguments", () => {
    const t = createTranslator({ locale: "en", messages: en, namespace: "footer" });
    expect(t("copyright", { year: 2026, name: "Adam Giszter" })).toBe("© 2026 Adam Giszter");
  });
});

describe("missing translations", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("falls back to the key path instead of an empty string", () => {
    const onError = vi.fn();
    const t = createTranslator({
      locale: "en",
      messages: {} as typeof en,
      namespace: "hero",
      onError,
      getMessageFallback,
    });

    expect(t("titleSolid")).toBe("hero.titleSolid");
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ code: IntlErrorCode.MISSING_MESSAGE }),
    );
  });

  it("logs missing messages loudly", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    onIntlError(new IntlError(IntlErrorCode.MISSING_MESSAGE, "hero.titleSolid"));
    expect(log).toHaveBeenCalledWith(expect.stringContaining("[i18n]"));
  });
});
