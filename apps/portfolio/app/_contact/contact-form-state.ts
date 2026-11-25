import type { ContactFieldErrors, ContactFormValues } from "@repo/lib";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: ContactFieldErrors;
  /** Echoed back on error so fields keep their values, including without JS. */
  values?: ContactFormValues;
  /** Changes on every submission so identical messages are re-announced. */
  submittedAt?: number;
};

export const initialContactFormState: ContactFormState = { status: "idle" };

/** Name of the hidden honeypot input; real users never fill it in. */
export const HONEYPOT_FIELD = "website";
