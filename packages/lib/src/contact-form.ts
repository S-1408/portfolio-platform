import * as z from "zod/mini";

export const contactFieldNames = ["name", "email", "message"] as const;

export type ContactFieldName = (typeof contactFieldNames)[number];

export const contactFormLimits = {
  nameMax: 100,
  emailMax: 254,
  messageMin: 10,
  messageMax: 5000,
} as const;

export type ContactValidationMessages = {
  nameRequired: string;
  nameTooLong: string;
  emailInvalid: string;
  emailTooLong: string;
  messageTooShort: string;
  messageTooLong: string;
};

export type ContactFormValues = Record<ContactFieldName, string>;

export type ContactFieldErrors = Partial<Record<ContactFieldName, string>>;

export type ContactValidationResult =
  | { success: true; data: ContactFormValues }
  | { success: false; fieldErrors: ContactFieldErrors };

// zod/mini keeps the browser bundle small: this schema runs client-side in
// the contact form as well as in the server action.
export function createContactSchema(messages: ContactValidationMessages) {
  return z.object({
    name: z
      .string()
      .check(
        z.trim(),
        z.minLength(1, messages.nameRequired),
        z.maxLength(contactFormLimits.nameMax, messages.nameTooLong),
      ),
    email: z.pipe(
      z
        .string()
        .check(
          z.trim(),
          z.maxLength(contactFormLimits.emailMax, messages.emailTooLong),
        ),
      z.email(messages.emailInvalid),
    ),
    message: z
      .string()
      .check(
        z.trim(),
        z.minLength(contactFormLimits.messageMin, messages.messageTooShort),
        z.maxLength(contactFormLimits.messageMax, messages.messageTooLong),
      ),
  });
}

export function validateContactForm(
  input: Partial<Record<ContactFieldName, unknown>>,
  messages: ContactValidationMessages,
): ContactValidationResult {
  const result = createContactSchema(messages).safeParse({
    name: typeof input.name === "string" ? input.name : "",
    email: typeof input.email === "string" ? input.email : "",
    message: typeof input.message === "string" ? input.message : "",
  });

  if (result.success) {
    return { success: true, data: result.data };
  }

  const fieldErrors: ContactFieldErrors = {};

  for (const issue of result.error.issues) {
    const field = issue.path[0];

    if (
      typeof field === "string" &&
      (contactFieldNames as readonly string[]).includes(field) &&
      !fieldErrors[field as ContactFieldName]
    ) {
      fieldErrors[field as ContactFieldName] = issue.message;
    }
  }

  return { success: false, fieldErrors };
}
