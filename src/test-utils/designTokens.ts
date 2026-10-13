import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const TOKENS_PATH = resolve(process.cwd(), "src/styles/tokens.css");

let cache: string | null = null;

function tokensCss(): string {
  cache ??= readFileSync(TOKENS_PATH, "utf8");
  return cache;
}

export function readPrimitive(name: string): string {
  const match = new RegExp(`--ds-${name}:\\s*(#[0-9a-fA-F]{6})`).exec(tokensCss());
  const value = match?.[1];
  if (!value) {
    throw new Error(`Primitive token --ds-${name} not found in ${TOKENS_PATH}`);
  }
  return value;
}