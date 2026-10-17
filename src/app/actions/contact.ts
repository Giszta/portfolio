"use server";

import {
  hasErrors,
  isHoneypotFilled,
  readContactForm,
  validateContact,
  type ContactResult,
} from "@/lib/contact";

export async function submitContact(formData: FormData): Promise<ContactResult> {
  // Bot wypełnił pole-pułapkę: odpowiadamy „sukcesem", żeby nie podpowiadać, że został wykryty.
  if (isHoneypotFilled(formData)) return { status: "success" };

  const errors = validateContact(readContactForm(formData));
  if (hasErrors(errors)) return { status: "error", reason: "validation", errors };

  // TODO (etap 5): wysyłka przez Resend i limit zapytań. Do tego czasu formularz nic nie wysyła.
  return { status: "error", reason: "failed" };
}
