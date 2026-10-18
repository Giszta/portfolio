import { describe, expect, it } from "vitest";
import { HONEYPOT_FIELD, isHoneypotFilled } from "./honeypot";

describe("isHoneypotFilled", () => {
  it("is false when the trap field is missing or blank", () => {
    expect(isHoneypotFilled(new FormData())).toBe(false);

    const blank = new FormData();
    blank.set(HONEYPOT_FIELD, "   ");
    expect(isHoneypotFilled(blank)).toBe(false);
  });

  it("is true when a bot filled the trap field", () => {
    const formData = new FormData();
    formData.set(HONEYPOT_FIELD, "http://spam.example");
    expect(isHoneypotFilled(formData)).toBe(true);
  });
});
