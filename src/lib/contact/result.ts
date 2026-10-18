import type { ContactErrors } from "./validation";

/**
 * Wynik wysyłki formularza. Unia rozróżniana polem `status` (i `reason` przy błędzie):
 * kompilator pilnuje, żeby UI obsłużył każdy przypadek i nie sięgnął po `errors`, gdy ich nie ma.
 */
export type ContactResult =
  | { status: "success" }
  | { status: "error"; reason: "validation"; errors: ContactErrors }
  | { status: "error"; reason: "rate-limited" }
  | { status: "error"; reason: "failed" };

/** Akcja wysyłki: w aplikacji to Server Action, w testach zwykła funkcja. */
export type ContactAction = (formData: FormData) => Promise<ContactResult>;
