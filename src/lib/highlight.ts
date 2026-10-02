export type TokenKind =
  "keyword" | "function" | "type" | "string" | "comment" | "literal" | "plain";

export interface Token {
  kind: TokenKind;
  text: string;
}

const KEYWORDS = new Set([
  "export",
  "function",
  "const",
  "let",
  "return",
  "type",
  "await",
  "async",
  "import",
  "from",
]);
const LITERALS = new Set(["true", "false", "null", "undefined"]);

const TOKEN_PATTERN =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*")|([A-Za-z_$][\w$]*)|(\d+(?:\.\d+)?)|(\s+)|(.)/gu;

function classifyWord(word: string, nextChar: string | undefined): TokenKind {
  if (KEYWORDS.has(word)) return "keyword";
  if (LITERALS.has(word)) return "literal";
  if (nextChar === "(") return "function";
  if (/^[A-Z]/.test(word)) return "type";
  return "plain";
}

function classify(match: RegExpMatchArray, line: string): TokenKind {
  const [text, comment, string, word, number] = match;
  if (comment) return "comment";
  if (string) return "string";
  if (number) return "literal";
  if (word) return classifyWord(word, line[(match.index ?? 0) + text.length]);
  return "plain";
}

export function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];

  for (const match of line.matchAll(TOKEN_PATTERN)) {
    const kind = classify(match, line);
    const previous = tokens.at(-1);

    if (kind === "plain" && previous?.kind === "plain") {
      previous.text += match[0];
    } else {
      tokens.push({ kind, text: match[0] });
    }
  }

  return tokens;
}

export function tokenize(code: string): Token[][] {
  return code.split("\n").map(tokenizeLine);
}
