import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import pl from "../../messages/pl.json";
import { routing } from "./routing";

type MessageTree = { [key: string]: string | MessageTree };

function flatten(tree: MessageTree, prefix = ""): Map<string, string> {
  const result = new Map<string, string>();
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      result.set(path, value);
    } else {
      for (const [nestedPath, nestedValue] of flatten(value, path)) {
        result.set(nestedPath, nestedValue);
      }
    }
  }
  return result;
}

function icuArguments(message: string): string[] {
  return [...message.matchAll(/\{(\w+)\}/g)].map((match) => match[1] ?? "").sort();
}

const catalogs = { en: flatten(en), pl: flatten(pl) } satisfies Record<
  (typeof routing.locales)[number],
  Map<string, string>
>;

const REQUIRED_NAMESPACES = [
  "common",
  "navigation",
  "hero",
  "projects",
  "engineering",
  "about",
  "technology",
  "contact",
  "footer",
  "caseStudies",
  "seo",
] as const;

describe("messages", () => {
  it("has a catalog for every configured locale", () => {
    expect(Object.keys(catalogs).sort()).toEqual([...routing.locales].sort());
  });

  it.each(REQUIRED_NAMESPACES)("defines the %s namespace in every locale", (namespace) => {
    expect(en).toHaveProperty(namespace);
    expect(pl).toHaveProperty(namespace);
  });

  it("pl has no missing keys compared to en", () => {
    const missing = [...catalogs.en.keys()].filter((key) => !catalogs.pl.has(key));
    expect(missing).toEqual([]);
  });

  it("pl has no extra keys compared to en", () => {
    const extra = [...catalogs.pl.keys()].filter((key) => !catalogs.en.has(key));
    expect(extra).toEqual([]);
  });

  it("has no empty translations", () => {
    for (const [locale, catalog] of Object.entries(catalogs)) {
      const empty = [...catalog].filter(([, value]) => value.trim() === "").map(([key]) => key);
      expect(empty, `empty messages in ${locale}`).toEqual([]);
    }
  });

  it("uses the same ICU arguments in every locale", () => {
    for (const [key, enValue] of catalogs.en) {
      const plValue = catalogs.pl.get(key) ?? "";
      expect(icuArguments(plValue), key).toEqual(icuArguments(enValue));
    }
  });
});
