"use client";

import { useActionState, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { contactContent } from "@repo/content";
import {
  contactFieldNames,
  contactFormLimits,
  validateContactForm,
} from "@repo/lib";
import type { ContactFieldErrors, ContactFieldName } from "@repo/lib";
import { Button } from "@repo/ui";
import { HONEYPOT_FIELD, initialContactFormState } from "./contact-form-state";
import { sendContactMessage } from "./send-contact-message";

const { form: copy, validation } = contactContent;

const inputClassName =
  "border-border bg-surface-raised text-ink focus-visible:outline-focus aria-[invalid=true]:border-accent w-full rounded-md border px-4 focus-visible:outline-2 focus-visible:outline-offset-2 aria-[invalid=true]:border-2";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    initialContactFormState,
  );
  // Errors found in the browser before submitting; null defers to the server.
  const [clientErrors, setClientErrors] = useState<ContactFieldErrors | null>(
    null,
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Native constraint validation covers the no-JS case; once hydrated we
    // show the shared zod messages instead of browser bubbles.
    setIsHydrated(true);
  }, []);

  const fieldErrors = clientErrors ?? state.fieldErrors ?? {};
  const statusMessage = clientErrors ? copy.invalidMessage : state.message;
  const statusTone = clientErrors ? "error" : state.status;
  const values = state.status === "error" ? state.values : undefined;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (isPending) {
      event.preventDefault();
      return;
    }

    const formData = new FormData(event.currentTarget);
    const result = validateContactForm(
      Object.fromEntries(
        contactFieldNames.map((name) => [name, formData.get(name)]),
      ),
      validation,
    );

    if (result.success) {
      setClientErrors(null);
      return;
    }

    event.preventDefault();
    setClientErrors(result.fieldErrors);

    const firstInvalid = contactFieldNames.find(
      (name) => result.fieldErrors[name],
    );

    if (firstInvalid) {
      event.currentTarget
        .querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
        ?.focus();
    }
  }

  function describedBy(name: ContactFieldName) {
    return fieldErrors[name] ? `contact-${name}-error` : undefined;
  }

  function renderError(name: ContactFieldName) {
    const error = fieldErrors[name];

    return error ? (
      <p
        id={`contact-${name}-error`}
        className="text-accent mt-2 text-sm font-medium"
      >
        {error}
      </p>
    ) : null;
  }

  function renderLabel(name: ContactFieldName, label: string) {
    return (
      <label className="mb-2 block font-medium" htmlFor={`contact-${name}`}>
        {label}{" "}
        <span className="text-muted text-sm font-normal">
          ({copy.requiredLabel})
        </span>
      </label>
    );
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate={isHydrated}
      className="relative space-y-5"
    >
      <div>
        {renderLabel("name", copy.nameLabel)}
        <input
          key={`name-${state.submittedAt ?? 0}`}
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={contactFormLimits.nameMax}
          defaultValue={values?.name}
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={describedBy("name")}
          className={`${inputClassName} min-h-11`}
        />
        {renderError("name")}
      </div>

      <div>
        {renderLabel("email", copy.emailLabel)}
        <input
          key={`email-${state.submittedAt ?? 0}`}
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={contactFormLimits.emailMax}
          defaultValue={values?.email}
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={describedBy("email")}
          className={`${inputClassName} min-h-11`}
        />
        {renderError("email")}
      </div>

      <div>
        {renderLabel("message", copy.messageLabel)}
        <textarea
          key={`message-${state.submittedAt ?? 0}`}
          id="contact-message"
          name="message"
          rows={6}
          required
          minLength={contactFormLimits.messageMin}
          maxLength={contactFormLimits.messageMax}
          defaultValue={values?.message}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={describedBy("message")}
          className={`${inputClassName} py-3`}
        />
        {renderError("message")}
      </div>

      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor={`contact-${HONEYPOT_FIELD}`}>
          {copy.honeypotLabel}
        </label>
        <input
          id={`contact-${HONEYPOT_FIELD}`}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" aria-disabled={isPending || undefined}>
          {isPending ? copy.submittingLabel : copy.submitLabel}
        </Button>
      </div>

      <div
        id="contact-form-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {statusMessage ? (
          <p
            key={clientErrors ? "client" : state.submittedAt}
            className={`rounded-md border px-4 py-3 font-medium ${
              statusTone === "success"
                ? "border-primary bg-surface text-ink"
                : "border-accent bg-accent-surface text-accent"
            }`}
          >
            {statusMessage}
          </p>
        ) : null}
      </div>
    </form>
  );
}
