"use client";

import { ArrowRight, Check, LoaderCircle, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui";
import { siteConfig } from "@/content/site";
import {
  CONTACT_LIMITS,
  HONEYPOT_FIELD,
  STARTED_AT_FIELD,
  hasErrors,
  readContactForm,
  validateContact,
  type ContactAction,
  type ContactErrors,
  type ContactField,
  type ContactInput,
  type ContactResult,
} from "@/lib/contact";

const FIELDS = ["name", "email", "message"] as const satisfies readonly ContactField[];

const EMPTY_VALUES: ContactInput = { name: "", email: "", message: "" };

const PANEL =
  "relative border border-line-strong bg-surface/75 p-6 sm:p-8 " +
  "before:absolute before:-top-px before:-left-px before:size-3 before:border-t before:border-l before:border-cyan " +
  "after:absolute after:-right-px after:-bottom-px after:size-3 after:border-r after:border-b after:border-cyan";

const CONTROL =
  "min-h-12 w-full rounded-xs border border-line-strong bg-canvas/80 px-3.5 py-3 text-base text-fg " +
  "placeholder:text-fg-muted outline-hidden transition-[border-color,box-shadow] duration-200 " +
  "focus-visible:border-cyan focus-visible:ring-2 focus-visible:ring-cyan/30 aria-invalid:border-warning";

interface FormState {
  result: ContactResult | null;
  /** Wpisane wartości — formularz React 19 po akcji się resetuje, więc wracamy do nich przez defaultValue. */
  values: ContactInput;
}

const INITIAL_STATE: FormState = { result: null, values: EMPTY_VALUES };

interface FieldProps {
  id: string;
  field: ContactField;
  label: string;
  placeholder: string;
  defaultValue: string;
  error: string | undefined;
  multiline?: boolean;
  type?: "text" | "email";
  autoComplete?: string;
}

function Field({
  id,
  field,
  label,
  placeholder,
  defaultValue,
  error,
  multiline = false,
  type = "text",
  autoComplete,
}: FieldProps) {
  const errorId = `${id}-error`;
  const shared = {
    id,
    name: field,
    defaultValue,
    placeholder,
    required: true,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: CONTROL,
  };

  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="font-mono text-label tracking-widest text-fg-muted uppercase">
        {label}
      </label>
      {multiline ? (
        <textarea {...shared} rows={6} className={`${CONTROL} resize-y`} />
      ) : (
        <input {...shared} type={type} autoComplete={autoComplete} />
      )}
      {error && (
        <p id={errorId} className="flex items-center gap-2 font-mono text-xs text-warning">
          <TriangleAlert aria-hidden="true" className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

interface ContactFormBodyProps {
  action: ContactAction;
  onReset: () => void;
}

function ContactFormBody({ action, onReset }: ContactFormBodyProps) {
  const t = useTranslations("contact.form");
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const openedAt = useRef<number | null>(null);

  // Moment otwarcia formularza: serwer odrzuca zgłoszenia wysłane szybciej, niż pisze człowiek.
  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  const [state, formAction, pending] = useActionState<FormState, FormData>(
    async (_previous, formData) => {
      const values = readContactForm(formData);
      const errors = validateContact(values);
      if (hasErrors(errors)) {
        return { values, result: { status: "error", reason: "validation", errors } };
      }
      try {
        if (openedAt.current !== null) formData.set(STARTED_AT_FIELD, String(openedAt.current));
        return { values, result: await action(formData) };
      } catch {
        return { values, result: { status: "error", reason: "failed" } };
      }
    },
    INITIAL_STATE,
  );

  const { result, values } = state;
  const errors: ContactErrors =
    result?.status === "error" && result.reason === "validation" ? result.errors : {};

  // Po nieudanej walidacji fokus trafia do pierwszego błędnego pola, po sukcesie do nagłówka potwierdzenia.
  useEffect(() => {
    const current = state.result;
    if (current?.status === "error" && current.reason === "validation") {
      const first = FIELDS.find((field) => current.errors[field]);
      if (first) {
        const element = formRef.current?.elements.namedItem(first);
        if (element instanceof HTMLElement) element.focus();
      }
    }
    if (current?.status === "success") headingRef.current?.focus();
  }, [state]);

  if (result?.status === "success") {
    return (
      <div role="status" className={`${PANEL} grid gap-4`}>
        <span className="grid size-11 place-items-center rounded-full border border-success text-success">
          <Check aria-hidden="true" className="size-5" />
        </span>
        <h3 ref={headingRef} tabIndex={-1} className="font-display text-2xl text-fg outline-hidden">
          {t("success.title")}
        </h3>
        <p className="text-base leading-relaxed text-fg-secondary">{t("success.text")}</p>
        <div>
          <Button variant="secondary" onClick={onReset}>
            {t("success.again")}
          </Button>
        </div>
      </div>
    );
  }

  const fieldError = (field: ContactField): string | undefined => {
    const code = errors[field];
    return code ? t(`errors.${code}`, { max: CONTACT_LIMITS[field] }) : undefined;
  };

  const fieldProps = (field: ContactField) => ({
    id: `${baseId}-${field}`,
    field,
    label: t(`${field}.label`),
    placeholder: t(`${field}.placeholder`),
    defaultValue: values[field],
    error: fieldError(field),
  });

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      aria-labelledby={titleId}
      aria-busy={pending}
      className={`${PANEL} grid gap-5`}
    >
      <h3 id={titleId} className="text-lg font-semibold text-fg">
        {t("title")}
      </h3>

      <Field {...fieldProps("name")} autoComplete="name" />
      <Field {...fieldProps("email")} type="email" autoComplete="email" />
      <Field {...fieldProps("message")} multiline />

      {/* Pułapka na boty: poza ekranem, bez fokusu i ukryta przed czytnikami ekranu. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </div>

      {result?.status === "error" && result.reason !== "validation" && (
        <p role="alert" className="flex items-start gap-2 text-sm text-warning">
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {result.reason === "rate-limited"
            ? t("rateLimited")
            : t("failure", { email: siteConfig.links.email ?? "" })}
        </p>
      )}

      <p className="text-sm leading-relaxed text-fg-muted">{t("note")}</p>

      <div>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? (
            <LoaderCircle aria-hidden="true" className="size-4 motion-safe:animate-spin" />
          ) : null}
          {pending ? t("sending") : t("submit")}
          {pending ? null : <ArrowRight aria-hidden="true" className="size-4" />}
        </Button>
      </div>
    </form>
  );
}

interface ContactFormProps {
  action: ContactAction;
}

export function ContactForm({ action }: ContactFormProps) {
  // Zmiana klucza montuje formularz od nowa, czyli czyści stan akcji i pola („Napisz kolejną").
  const [attempt, setAttempt] = useState(0);

  return (
    <ContactFormBody
      key={attempt}
      action={action}
      onReset={() => setAttempt((count) => count + 1)}
    />
  );
}
