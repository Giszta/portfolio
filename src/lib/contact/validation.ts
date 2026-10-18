/** Limity pól formularza — jedno miejsce prawdy dla klienta i serwera. */
export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  message: 5000,
} as const;

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export type ContactField = keyof ContactInput;

/** Kody błędów odpowiadają kluczom w messages: contact.form.errors.<kod>. */
export type ContactErrorCode =
  | "nameRequired"
  | "nameTooLong"
  | "emailRequired"
  | "emailInvalid"
  | "messageRequired"
  | "messageTooLong";

export type ContactErrors = Partial<Record<ContactField, ContactErrorCode>>;

/** Celowo prosty wzorzec: ma wyłapać literówki, a nie rozstrzygać o poprawności adresu (to robi dostawca poczty). */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (name === "") errors.name = "nameRequired";
  else if (name.length > CONTACT_LIMITS.name) errors.name = "nameTooLong";

  if (email === "") errors.email = "emailRequired";
  else if (email.length > CONTACT_LIMITS.email || !EMAIL_PATTERN.test(email)) {
    errors.email = "emailInvalid";
  }

  if (message === "") errors.message = "messageRequired";
  else if (message.length > CONTACT_LIMITS.message) errors.message = "messageTooLong";

  return errors;
}

export function hasErrors(errors: ContactErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Pola formularza jako zwykłe teksty; brakujące lub niebędące tekstem (np. plik) dają pusty napis. */
export function readContactForm(formData: FormData): ContactInput {
  const text = (key: ContactField): string => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };
  return { name: text("name"), email: text("email"), message: text("message") };
}
