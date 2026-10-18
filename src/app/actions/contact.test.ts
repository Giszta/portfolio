import { describe, expect, it } from "vitest";
import { HONEYPOT_FIELD } from "@/lib/contact";
import { submitContact } from "./contact";

function formData(entries: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) data.set(key, value);
  return data;
}

describe("submitContact", () => {
  it("re-validates on the server and reports every error", async () => {
    const result = await submitContact(formData({ name: "", email: "x", message: "" }));
    expect(result).toEqual({
      status: "error",
      reason: "validation",
      errors: { name: "nameRequired", email: "emailInvalid", message: "messageRequired" },
    });
  });

  it("answers a bot that filled the honeypot with a fake success", async () => {
    const result = await submitContact(
      formData({ name: "", email: "", message: "", [HONEYPOT_FIELD]: "spam" }),
    );
    expect(result).toEqual({ status: "success" });
  });
});
