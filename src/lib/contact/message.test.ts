import { describe, expect, it } from "vitest";
import { buildContactMessage } from "./message";

const addresses = { from: "Portfolio <onboarding@resend.dev>", to: "me@example.com" };

describe("buildContactMessage", () => {
  it("replies to the sender and puts their details above the message", () => {
    expect(
      buildContactMessage(
        { name: " Anna ", email: " anna@firma.pl ", message: " Cześć \n" },
        addresses,
      ),
    ).toEqual({
      ...addresses,
      replyTo: "anna@firma.pl",
      subject: "Portfolio — Anna",
      text: "Name: Anna\nEmail: anna@firma.pl\n\nCześć",
    });
  });

  it("keeps line breaks out of the subject", () => {
    const { subject } = buildContactMessage(
      { name: "Anna\r\nBcc: x@y.z", email: "anna@firma.pl", message: "Hi" },
      addresses,
    );
    expect(subject).toBe("Portfolio — Anna Bcc: x@y.z");
    expect(subject).not.toMatch(/[\r\n]/);
  });
});
