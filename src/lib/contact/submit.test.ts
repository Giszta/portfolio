import { describe, expect, it, vi } from "vitest";
import { HONEYPOT_FIELD } from "./honeypot";
import { handleContact, type ContactDeps } from "./submit";
import { MIN_FILL_MS, STARTED_AT_FIELD } from "./timing";

const NOW = 1_000_000;

function formData(entries: Record<string, string> = {}): FormData {
  const data = new FormData();
  const valid = { name: "Anna", email: "anna@firma.pl", message: " Cześć " };
  for (const [key, value] of Object.entries({ ...valid, ...entries })) data.set(key, value);
  return data;
}

function setup(overrides: Partial<ContactDeps> = {}) {
  const mailer = vi.fn(async () => true);
  const limiter = { take: vi.fn(() => true) };
  const clientId = vi.fn(async () => "1.2.3.4");
  const deps: ContactDeps = { now: () => NOW, clientId, limiter, mailer, ...overrides };
  return { deps, mailer, limiter, clientId };
}

describe("handleContact", () => {
  it("sends a valid message and reports success", async () => {
    const { deps, mailer, limiter } = setup();
    const result = await handleContact(formData(), deps);

    expect(result).toEqual({ status: "success" });
    expect(limiter.take).toHaveBeenCalledWith("1.2.3.4");
    expect(mailer).toHaveBeenCalledWith({
      name: "Anna",
      email: "anna@firma.pl",
      message: " Cześć ",
    });
  });

  it("fakes success for a bot and sends nothing", async () => {
    const { deps, mailer, limiter } = setup();
    const result = await handleContact(formData({ [HONEYPOT_FIELD]: "spam" }), deps);

    expect(result).toEqual({ status: "success" });
    expect(mailer).not.toHaveBeenCalled();
    expect(limiter.take).not.toHaveBeenCalled();
  });

  it("refuses a form submitted faster than a human could write it", async () => {
    const { deps, mailer } = setup();
    const result = await handleContact(
      formData({ [STARTED_AT_FIELD]: String(NOW - (MIN_FILL_MS - 1)) }),
      deps,
    );

    expect(result).toEqual({ status: "error", reason: "failed" });
    expect(mailer).not.toHaveBeenCalled();
  });

  it("accepts a form filled slowly enough or without a timestamp", async () => {
    const slow = setup();
    expect(
      await handleContact(formData({ [STARTED_AT_FIELD]: String(NOW - MIN_FILL_MS) }), slow.deps),
    ).toEqual({ status: "success" });

    const none = setup();
    expect(await handleContact(formData(), none.deps)).toEqual({ status: "success" });
  });

  it("validates before touching the limiter, the IP lookup or the mailer", async () => {
    const { deps, mailer, limiter, clientId } = setup();
    const result = await handleContact(formData({ email: "nope" }), deps);

    expect(result).toEqual({
      status: "error",
      reason: "validation",
      errors: { email: "emailInvalid" },
    });
    expect(clientId).not.toHaveBeenCalled();
    expect(limiter.take).not.toHaveBeenCalled();
    expect(mailer).not.toHaveBeenCalled();
  });

  it("reports rate limiting without sending", async () => {
    const { deps, mailer } = setup({ limiter: { take: () => false } });
    expect(await handleContact(formData(), deps)).toEqual({
      status: "error",
      reason: "rate-limited",
    });
    expect(mailer).not.toHaveBeenCalled();
  });

  it("fails when mail is not configured", async () => {
    const { deps } = setup({ mailer: null });
    expect(await handleContact(formData(), deps)).toEqual({ status: "error", reason: "failed" });
  });

  it("fails when the provider refuses or throws", async () => {
    const refused = setup({ mailer: async () => false });
    expect(await handleContact(formData(), refused.deps)).toEqual({
      status: "error",
      reason: "failed",
    });

    const broken = setup({
      mailer: async () => {
        throw new Error("network");
      },
    });
    expect(await handleContact(formData(), broken.deps)).toEqual({
      status: "error",
      reason: "failed",
    });
  });
});
