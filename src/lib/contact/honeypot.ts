/** Nazwa ukrytego pola-pułapki. Człowiek go nie widzi, bot często je wypełnia. */
export const HONEYPOT_FIELD = "website";

export function isHoneypotFilled(formData: FormData): boolean {
  const value = formData.get(HONEYPOT_FIELD);
  return typeof value === "string" ? value.trim() !== "" : value !== null;
}
