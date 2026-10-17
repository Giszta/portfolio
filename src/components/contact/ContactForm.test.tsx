import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import en from "../../../messages/en.json";
import { siteConfig } from "@/content/site";
import {
  CONTACT_LIMITS,
  HONEYPOT_FIELD,
  type ContactAction,
  type ContactResult,
} from "@/lib/contact";
import { renderWithIntl } from "@/test-utils/renderWithIntl";
import { ContactForm } from "./ContactForm";

const form = en.contact.form;

const VALID = {
  name: "Anna",
  email: "anna@firma.pl",
  message: "Szukamy inżyniera z kontekstem produkcyjnym.",
};

function fill(values: Partial<typeof VALID>) {
  for (const [field, value] of Object.entries(values)) {
    const label = form[field as keyof typeof VALID].label;
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  }
}

async function submit() {
  await act(async () => {
    fireEvent.submit(screen.getByRole("form", { name: form.title }));
  });
}

function setup(action: ContactAction) {
  return renderWithIntl(<ContactForm action={action} />);
}

const ok: ContactAction = async () => ({ status: "success" });

describe("ContactForm", () => {
  it("renders three labelled fields and a submit button", () => {
    setup(ok);
    expect(screen.getByRole("form", { name: form.title })).toBeInTheDocument();
    expect(screen.getByLabelText(form.name.label)).toBeInTheDocument();
    expect(screen.getByLabelText(form.email.label)).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(form.message.label).tagName).toBe("TEXTAREA");
    expect(screen.getByRole("button", { name: form.submit })).toBeEnabled();
  });

  it("hides the honeypot from keyboard and assistive technology", () => {
    const { container } = setup(ok);
    const trap = container.querySelector(`input[name="${HONEYPOT_FIELD}"]`);
    expect(trap).not.toBeNull();
    expect(trap).toHaveAttribute("tabindex", "-1");
    expect(trap?.closest("[aria-hidden='true']")).not.toBeNull();
    expect(screen.queryByLabelText(HONEYPOT_FIELD)).toBeNull();
  });

  it("shows every error, marks fields invalid, focuses the first one and does not call the action", async () => {
    const action = vi.fn(ok);
    setup(action);
    await submit();

    expect(action).not.toHaveBeenCalled();
    expect(screen.getByText(form.errors.nameRequired)).toBeInTheDocument();
    expect(screen.getByText(form.errors.emailRequired)).toBeInTheDocument();
    expect(screen.getByText(form.errors.messageRequired)).toBeInTheDocument();

    const name = screen.getByLabelText(form.name.label);
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription(form.errors.nameRequired);
    expect(name).toHaveFocus();
  });

  it("explains an invalid email and keeps what was typed", async () => {
    setup(ok);
    fill({ ...VALID, email: "anna@" });
    await submit();

    expect(screen.getByText(form.errors.emailInvalid)).toBeInTheDocument();
    expect(screen.getByLabelText(form.email.label)).toHaveValue("anna@");
    expect(screen.getByLabelText(form.name.label)).toHaveValue(VALID.name);
    expect(screen.getByLabelText(form.email.label)).toHaveFocus();
  });

  it("interpolates the limit into the too-long message", async () => {
    setup(ok);
    fill({ ...VALID, name: "a".repeat(CONTACT_LIMITS.name + 1) });
    await submit();

    expect(
      screen.getByText(form.errors.nameTooLong.replace("{max}", String(CONTACT_LIMITS.name))),
    ).toBeInTheDocument();
  });

  it("sends the entered values to the action", async () => {
    const action = vi.fn(ok);
    setup(action);
    fill(VALID);
    await submit();

    expect(action).toHaveBeenCalledTimes(1);
    const sent = action.mock.calls[0]?.[0];
    expect(sent?.get("name")).toBe(VALID.name);
    expect(sent?.get("email")).toBe(VALID.email);
    expect(sent?.get("message")).toBe(VALID.message);
  });

  it("disables the button and says so while sending", async () => {
    let finish: (result: ContactResult) => void = () => {};
    const action: ContactAction = () =>
      new Promise<ContactResult>((resolve) => {
        finish = resolve;
      });
    setup(action);
    fill(VALID);
    await submit();

    const button = screen.getByRole("button", { name: form.sending });
    expect(button).toBeDisabled();
    expect(screen.getByRole("form", { name: form.title })).toHaveAttribute("aria-busy", "true");

    await act(async () => finish({ status: "success" }));
    expect(screen.queryByRole("button", { name: form.sending })).toBeNull();
  });

  it("confirms success, moves focus to the confirmation and lets you write again", async () => {
    setup(ok);
    fill(VALID);
    await submit();

    expect(screen.getByRole("status")).toBeInTheDocument();
    const heading = screen.getByRole("heading", { name: form.success.title });
    expect(heading).toHaveFocus();
    expect(screen.queryByLabelText(form.name.label)).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: form.success.again }));
    expect(screen.getByLabelText(form.name.label)).toHaveValue("");
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("announces a failed send with the email fallback and keeps the message", async () => {
    setup(async () => ({ status: "error", reason: "failed" }));
    fill(VALID);
    await submit();

    expect(screen.getByRole("alert")).toHaveTextContent(
      form.failure.replace("{email}", siteConfig.links.email ?? ""),
    );
    expect(screen.getByLabelText(form.message.label)).toHaveValue(VALID.message);
    expect(screen.getByRole("button", { name: form.submit })).toBeEnabled();
  });

  it("announces rate limiting", async () => {
    setup(async () => ({ status: "error", reason: "rate-limited" }));
    fill(VALID);
    await submit();

    expect(screen.getByRole("alert")).toHaveTextContent(form.rateLimited);
  });

  it("treats a throwing action as a failed send", async () => {
    setup(async () => {
      throw new Error("network");
    });
    fill(VALID);
    await submit();

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByLabelText(form.name.label)).toHaveValue(VALID.name);
  });
});
