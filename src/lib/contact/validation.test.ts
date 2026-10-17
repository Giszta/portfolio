import { describe, expect, it } from "vitest";
import {
  CONTACT_LIMITS,
  hasErrors,
  readContactForm,
  validateContact,
  type ContactInput,
} from "./validation";

const valid: ContactInput = {
  name: "Anna",
  email: "anna@firma.pl",
  message: "Dzień dobry, szukamy inżyniera z kontekstem produkcyjnym.",
};

describe("validateContact", () => {
  it("accepts a complete message", () => {
    expect(validateContact(valid)).toEqual({});
  });

  it("treats whitespace-only fields as missing", () => {
    expect(validateContact({ name: "  ", email: "\t", message: "\n " })).toEqual({
      name: "nameRequired",
      email: "emailRequired",
      message: "messageRequired",
    });
  });

  it("reports every problem at once, not just the first", () => {
    const errors = validateContact({ name: "", email: "anna@", message: "" });
    expect(Object.keys(errors).sort()).toEqual(["email", "message", "name"]);
  });

  it("accepts the name at the limit and rejects it above", () => {
    const at = "a".repeat(CONTACT_LIMITS.name);
    expect(validateContact({ ...valid, name: at })).toEqual({});
    expect(validateContact({ ...valid, name: at + "a" })).toEqual({ name: "nameTooLong" });
  });

  it("accepts the message at the limit and rejects it above", () => {
    const at = "a".repeat(CONTACT_LIMITS.message);
    expect(validateContact({ ...valid, message: at })).toEqual({});
    expect(validateContact({ ...valid, message: at + "a" })).toEqual({
      message: "messageTooLong",
    });
  });

  it.each(["a.m.giszter@gmail.com", "a@b.co", "  anna@firma.pl  ", "imie+tag@domena.com.pl"])(
    "accepts the email %j",
    (email) => {
      expect(validateContact({ ...valid, email })).toEqual({});
    },
  );

  it.each(["anna", "anna@", "@firma.pl", "anna@firma", "an na@firma.pl", "anna@@firma.pl"])(
    "rejects the email %j as invalid",
    (email) => {
      expect(validateContact({ ...valid, email })).toEqual({ email: "emailInvalid" });
    },
  );

  it("rejects an email longer than the limit", () => {
    const email = "a".repeat(CONTACT_LIMITS.email) + "@firma.pl";
    expect(validateContact({ ...valid, email })).toEqual({ email: "emailInvalid" });
  });
});

describe("hasErrors", () => {
  it("is false for no errors and true otherwise", () => {
    expect(hasErrors({})).toBe(false);
    expect(hasErrors({ name: "nameRequired" })).toBe(true);
  });
});

describe("readContactForm", () => {
  it("reads the three text fields", () => {
    const formData = new FormData();
    formData.set("name", "Anna");
    formData.set("email", "anna@firma.pl");
    formData.set("message", "Cześć");
    expect(readContactForm(formData)).toEqual({
      name: "Anna",
      email: "anna@firma.pl",
      message: "Cześć",
    });
  });

  it("turns missing fields and files into empty strings", () => {
    const formData = new FormData();
    formData.set("name", new File(["x"], "x.txt"));
    expect(readContactForm(formData)).toEqual({ name: "", email: "", message: "" });
  });
});
