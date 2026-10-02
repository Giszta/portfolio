import { describe, expect, it } from "vitest";
import { HERO_CODE } from "@/content/hero/code";
import { tokenize, tokenizeLine, type TokenKind } from "./highlight";

const kindOf = (line: string, text: string): TokenKind | undefined =>
  tokenizeLine(line).find((token) => token.text === text)?.kind;

describe("highlight", () => {
  it("never loses a character of the hero code", () => {
    const rebuilt = tokenize(HERO_CODE)
      .map((line) => line.map((token) => token.text).join(""))
      .join("\n");
    expect(rebuilt).toBe(HERO_CODE);
  });

  it("marks keywords and function calls", () => {
    const line = "  const model = prototype(constraints);";
    expect(kindOf(line, "const")).toBe("keyword");
    expect(kindOf(line, "prototype")).toBe("function");
  });

  it("marks strings and trailing comments as single tokens", () => {
    const line = 'const a = "7+ years"; // note × ai';
    expect(kindOf(line, '"7+ years"')).toBe("string");
    expect(kindOf(line, "// note × ai")).toBe("comment");
  });

  it("treats capitalized names as types and booleans as literals", () => {
    const line = "type Tolerance = { typed: true };";
    expect(kindOf(line, "Tolerance")).toBe("type");
    expect(kindOf(line, "true")).toBe("literal");
  });

  it("merges neighbouring plain tokens", () => {
    expect(tokenizeLine("a = b")).toEqual([{ kind: "plain", text: "a = b" }]);
  });
});
