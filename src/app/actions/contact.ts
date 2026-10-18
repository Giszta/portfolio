"use server";

import { headers } from "next/headers";
import type { ContactResult } from "@/lib/contact";
import { readMailConfig } from "@/lib/contact/config";
import { createRateLimiter } from "@/lib/contact/rateLimit";
import { handleContact } from "@/lib/contact/submit";
import { createResendMailer } from "@/lib/contact/transport";

// 3 wiadomości na 10 minut z jednego adresu (pamięć instancji, patrz rateLimit.ts).
const limiter = createRateLimiter({ limit: 3, windowMs: 10 * 60 * 1000 });

async function clientId(): Promise<string> {
  const requestHeaders = await headers();
  return (
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    requestHeaders.get("x-real-ip") ??
    "unknown"
  );
}

export async function submitContact(formData: FormData): Promise<ContactResult> {
  const config = readMailConfig(process.env);
  if (config === null) console.warn("[contact] RESEND_API_KEY is not set, messages are not sent");

  return handleContact(formData, {
    now: Date.now,
    clientId,
    limiter,
    mailer: config === null ? null : createResendMailer(config),
  });
}
