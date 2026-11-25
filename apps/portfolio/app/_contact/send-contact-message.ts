"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { contactContent } from "@repo/content";
import { createRateLimiter, validateContactForm } from "@repo/lib";
import type { ContactFormValues } from "@repo/lib";
import { HONEYPOT_FIELD, type ContactFormState } from "./contact-form-state";

const DEFAULT_FROM_EMAIL = "Portfolio Contact <onboarding@resend.dev>";

// Best-effort guard: state is per server instance, so serverless cold starts
// reset it. Good enough to blunt casual spam without external infrastructure.
const rateLimiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

function readField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

async function getClientKey() {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for");

  return (
    forwardedFor?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown"
  );
}

export async function sendContactMessage(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const { form, validation, emailSubjectPrefix } = contactContent;
  const submittedAt = Date.now();
  const values: ContactFormValues = {
    name: readField(formData, "name"),
    email: readField(formData, "email"),
    message: readField(formData, "message"),
  };

  if (readField(formData, HONEYPOT_FIELD)) {
    // Pretend it worked so bots get no signal.
    return { status: "success", message: form.successMessage, submittedAt };
  }

  const result = validateContactForm(values, validation);

  if (!result.success) {
    return {
      status: "error",
      message: form.invalidMessage,
      fieldErrors: result.fieldErrors,
      values,
      submittedAt,
    };
  }

  const rateLimit = rateLimiter.check(await getClientKey());

  if (!rateLimit.allowed) {
    return {
      status: "error",
      message: form.rateLimitedMessage,
      values,
      submittedAt,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !toEmail) {
    console.warn(
      "[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set; message was not sent.",
    );

    return {
      status: "error",
      message: form.unavailableMessage,
      values,
      submittedAt,
    };
  }

  const { name, email, message } = result.data;

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM_EMAIL,
      to: toEmail,
      replyTo: email,
      subject: `${emailSubjectPrefix} ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    if (error) {
      console.error("[contact] Resend rejected the message:", error);

      return {
        status: "error",
        message: form.sendFailedMessage,
        values,
        submittedAt,
      };
    }
  } catch (error) {
    console.error("[contact] Failed to reach Resend:", error);

    return {
      status: "error",
      message: form.sendFailedMessage,
      values,
      submittedAt,
    };
  }

  return { status: "success", message: form.successMessage, submittedAt };
}
