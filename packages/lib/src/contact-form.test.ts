import { describe, expect, it } from "vitest";
import { contactFormLimits, validateContactForm } from "./contact-form.js";

const messages = {
  nameRequired: "name-required",
  nameTooLong: "name-too-long",
  emailInvalid: "email-invalid",
  emailTooLong: "email-too-long",
  messageTooShort: "message-too-short",
  messageTooLong: "message-too-long",
};

describe("validateContactForm", () => {
  it("accepts valid input and trims whitespace", () => {
    const result = validateContactForm(
      {
        name: "  Ada Lovelace ",
        email: " ada@example.com ",
        message: "  Hello, I would like to chat.  ",
      },
      messages,
    );

    expect(result).toEqual({
      success: true,
      data: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        message: "Hello, I would like to chat.",
      },
    });
  });

  it("returns one message per invalid field", () => {
    const result = validateContactForm(
      { name: "   ", email: "not-an-email", message: "short" },
      messages,
    );

    expect(result).toEqual({
      success: false,
      fieldErrors: {
        name: "name-required",
        email: "email-invalid",
        message: "message-too-short",
      },
    });
  });

  it("treats missing or non-string values as empty", () => {
    const result = validateContactForm({ name: 42 }, messages);

    expect(result.success).toBe(false);
    expect(!result.success && result.fieldErrors.name).toBe("name-required");
  });

  it("enforces maximum lengths", () => {
    const result = validateContactForm(
      {
        name: "a".repeat(contactFormLimits.nameMax + 1),
        email: `${"a".repeat(contactFormLimits.emailMax)}@example.com`,
        message: "a".repeat(contactFormLimits.messageMax + 1),
      },
      messages,
    );

    expect(result).toEqual({
      success: false,
      fieldErrors: {
        name: "name-too-long",
        email: "email-too-long",
        message: "message-too-long",
      },
    });
  });
});
