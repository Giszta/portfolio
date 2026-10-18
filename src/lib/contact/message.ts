import type { MailConfig } from "./config";
import type { ContactInput } from "./validation";

export interface ContactMessage {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
}

/** Jedna linia: usuwa łamania wiersza, żeby dane od użytkownika nie wstrzyknęły nagłówków. */
function oneLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function buildContactMessage(
  input: ContactInput,
  { from, to }: Pick<MailConfig, "from" | "to">,
): ContactMessage {
  const name = oneLine(input.name);
  const email = input.email.trim();
  return {
    from,
    to,
    replyTo: email,
    subject: `Portfolio — ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${input.message.trim()}`,
  };
}
