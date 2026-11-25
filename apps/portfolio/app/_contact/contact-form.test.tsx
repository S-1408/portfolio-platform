import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { contactContent } from "@repo/content";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ContactFormState } from "./contact-form-state";
import { ContactForm } from "./contact-form";

// The real module is a server action (next/headers, Resend); replace it.
const sendContactMessage = vi.hoisted(() =>
  vi.fn<
    (state: ContactFormState, data: FormData) => Promise<ContactFormState>
  >(),
);
vi.mock("./send-contact-message", () => ({ sendContactMessage }));

const { form: copy, validation } = contactContent;

function fields() {
  return {
    name: screen.getByRole("textbox", { name: new RegExp(copy.nameLabel) }),
    email: screen.getByRole("textbox", {
      name: new RegExp(`^${copy.emailLabel}`),
    }),
    message: screen.getByRole("textbox", {
      name: new RegExp(copy.messageLabel),
    }),
    submit: screen.getByRole("button", { name: copy.submitLabel }),
  };
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  const { name, email, message } = fields();
  await user.type(name, "Ada Lovelace");
  await user.type(email, "ada@example.com");
  await user.type(message, "I'd love to talk about a frontend role.");
}

beforeEach(() => {
  sendContactMessage.mockReset();
});

describe("ContactForm", () => {
  it("labels every field and marks them required", () => {
    render(<ContactForm />);
    const { name, email, message } = fields();

    for (const field of [name, email, message]) {
      expect(field).toBeRequired();
      expect(field).not.toHaveAttribute("aria-invalid");
    }
    expect(email).toHaveAttribute("type", "email");
    expect(email).toHaveAttribute("autocomplete", "email");
  });

  it("hides the honeypot field from assistive technology", () => {
    render(<ContactForm />);

    expect(
      screen.queryByRole("textbox", { name: copy.honeypotLabel }),
    ).not.toBeInTheDocument();
  });

  it("blocks submission and announces errors for an empty form", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(fields().submit);

    expect(sendContactMessage).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent(copy.invalidMessage);

    const { name, email, message } = fields();
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription(validation.nameRequired);
    expect(email).toHaveAccessibleDescription(validation.emailInvalid);
    expect(message).toHaveAccessibleDescription(validation.messageTooShort);
    // Focus jumps to the first invalid field.
    expect(name).toHaveFocus();
  });

  it("validates individual fields with the shared zod schema", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    const { name, email, message, submit } = fields();

    await user.type(name, "Ada");
    await user.type(email, "not-an-email");
    await user.type(message, "short");
    await user.click(submit);

    expect(sendContactMessage).not.toHaveBeenCalled();
    expect(name).not.toHaveAttribute("aria-invalid");
    expect(email).toHaveAccessibleDescription(validation.emailInvalid);
    expect(email).toHaveFocus();
    expect(message).toHaveAccessibleDescription(validation.messageTooShort);
  });

  it("submits valid input and announces success", async () => {
    sendContactMessage.mockResolvedValue({
      status: "success",
      message: copy.successMessage,
      submittedAt: 1,
    });
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillValid(user);
    await user.click(fields().submit);

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(copy.successMessage),
    );
    expect(sendContactMessage).toHaveBeenCalledTimes(1);
    const formData = sendContactMessage.mock.calls[0]![1];
    expect(formData.get("name")).toBe("Ada Lovelace");
    expect(formData.get("email")).toBe("ada@example.com");
    // Fields are cleared after a successful send.
    expect(fields().name).toHaveValue("");
  });

  it("shows server errors and keeps the typed values", async () => {
    sendContactMessage.mockResolvedValue({
      status: "error",
      message: copy.unavailableMessage,
      values: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        message: "I'd love to talk about a frontend role.",
      },
      submittedAt: 2,
    });
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillValid(user);
    await user.click(fields().submit);

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        copy.unavailableMessage,
      ),
    );
    expect(fields().name).toHaveValue("Ada Lovelace");
    expect(fields().email).toHaveValue("ada@example.com");
  });

  it("clears client errors once the input is fixed", async () => {
    sendContactMessage.mockResolvedValue({
      status: "success",
      message: copy.successMessage,
      submittedAt: 3,
    });
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(fields().submit);
    expect(screen.getByRole("status")).toHaveTextContent(copy.invalidMessage);

    await fillValid(user);
    await user.click(fields().submit);

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(copy.successMessage),
    );
    expect(fields().name).not.toHaveAttribute("aria-invalid");
  });
});
