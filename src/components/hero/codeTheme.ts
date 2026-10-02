import type { TokenKind } from "@/lib/highlight";

/** Kolory tokenów kodu w wale — wspólne dla wersji desktop i mobile. */
export const TOKEN_FILL: Record<TokenKind, string> = {
  keyword: "fill-accent",
  function: "fill-cyan",
  type: "fill-fg",
  string: "fill-success",
  comment: "fill-fg-muted",
  literal: "fill-amber",
  plain: "fill-fg-secondary",
};
