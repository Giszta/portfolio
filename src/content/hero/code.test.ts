import ts from "typescript";
import { describe, expect, it } from "vitest";
import { HERO_CODE } from "./code";

const MAX_LINES = 14;
const MAX_COLUMNS = 72;

describe("HERO_CODE", () => {
  it("is syntactically valid TypeScript", () => {
    const { diagnostics = [] } = ts.transpileModule(HERO_CODE, {
      reportDiagnostics: true,
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    });
    const messages = diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n"));
    expect(messages).toEqual([]);
  });

  it(`fits the shaft height (max ${MAX_LINES} lines)`, () => {
    expect(HERO_CODE.split("\n").length).toBeLessThanOrEqual(MAX_LINES);
  });

  it(`fits the shaft length (max ${MAX_COLUMNS} columns)`, () => {
    const longest = Math.max(...HERO_CODE.split("\n").map((line) => line.length));
    expect(longest).toBeLessThanOrEqual(MAX_COLUMNS);
  });
});
