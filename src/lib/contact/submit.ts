import { isHoneypotFilled } from "./honeypot";
import type { RateLimiter } from "./rateLimit";
import type { ContactResult } from "./result";
import { MIN_FILL_MS, STARTED_AT_FIELD } from "./timing";
import { hasErrors, readContactForm, validateContact, type ContactInput } from "./validation";

/** Wysyła wiadomość; true = dostarczona do dostawcy poczty. */
export type ContactMailer = (input: ContactInput) => Promise<boolean>;

export interface ContactDeps {
  now: () => number;
  /** Wywoływane dopiero, gdy potrzebny jest klucz limitu (po walidacji). */
  clientId: () => Promise<string>;
  limiter: RateLimiter;
  /** null = brak konfiguracji poczty. */
  mailer: ContactMailer | null;
}

const FAILED: ContactResult = { status: "error", reason: "failed" };

function isTooFast(formData: FormData, now: number): boolean {
  const raw = formData.get(STARTED_AT_FIELD);
  if (typeof raw !== "string") return false;
  const startedAt = Number(raw);
  return Number.isFinite(startedAt) && now - startedAt < MIN_FILL_MS;
}

export async function handleContact(formData: FormData, deps: ContactDeps): Promise<ContactResult> {
  // Bot wypełnił pułapkę: „sukces", żeby nie podpowiadać, że został wykryty.
  if (isHoneypotFilled(formData)) return { status: "success" };
  if (isTooFast(formData, deps.now())) return FAILED;

  const input = readContactForm(formData);
  const errors = validateContact(input);
  if (hasErrors(errors)) return { status: "error", reason: "validation", errors };

  if (!deps.limiter.take(await deps.clientId())) {
    return { status: "error", reason: "rate-limited" };
  }
  if (deps.mailer === null) return FAILED;

  try {
    return (await deps.mailer(input)) ? { status: "success" } : FAILED;
  } catch {
    return FAILED;
  }
}
