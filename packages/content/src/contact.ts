import { profile } from "./profile.js";
import type { ContactContent } from "./types.js";

export const contactContent: ContactContent = {
  pitchHeading: "Wanna hire me?",
  pitch:
    "I'm open to senior frontend roles and freelance projects. If you're building something accessible, fast, and well-crafted, I'd love to hear about it.",
  detailsHeading: "Contact details",
  emailLabel: "Email",
  email: profile.email,
  locationLabel: "Location",
  location: profile.location,
  socialProfilesLabel: "Find me on",
  form: {
    heading: "Send a message",
    nameLabel: "Name",
    emailLabel: "Email",
    messageLabel: "Message",
    requiredLabel: "required",
    honeypotLabel: "Leave this field empty",
    submitLabel: "Send message",
    submittingLabel: "Sending…",
    successMessage: "Thanks! Your message has been sent. I'll reply soon.",
    invalidMessage: "Please fix the highlighted fields and try again.",
    rateLimitedMessage:
      "You've sent several messages in a short time. Please try again in a few minutes.",
    unavailableMessage: `The contact form isn't available right now. Please email me directly at ${profile.email}.`,
    sendFailedMessage: `Something went wrong while sending your message. Please try again or email me at ${profile.email}.`,
  },
  validation: {
    nameRequired: "Please enter your name.",
    nameTooLong: "Name must be 100 characters or fewer.",
    emailInvalid: "Please enter a valid email address.",
    emailTooLong: "Email must be 254 characters or fewer.",
    messageTooShort: "Message must be at least 10 characters.",
    messageTooLong: "Message must be 5000 characters or fewer.",
  },
  emailSubjectPrefix: "Portfolio contact from",
};
