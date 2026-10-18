import { Resend } from "resend";
import type { MailConfig } from "./config";
import { buildContactMessage } from "./message";
import type { ContactMailer } from "./submit";

/** Jedyne miejsce, które zna Resend. Tylko po stronie serwera (nie eksportować z index.ts). */
export function createResendMailer(config: MailConfig): ContactMailer {
  const resend = new Resend(config.apiKey);
  return async (input) => {
    const { error } = await resend.emails.send(buildContactMessage(input, config));
    if (error !== null)
      console.error("[contact] Resend refused the message:", error.name, error.message);
    return error === null;
  };
}
