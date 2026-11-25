import { profile } from "./profile.js";
import type { FooterContent } from "./types.js";

export const footerContent: FooterContent = {
  hireHeading: "Wanna hire me?",
  hireBlurb: "Reach me out at any of the social networks.",
  socialProfilesLabel: "Social profiles",
  locationLabel: "Location",
  location: profile.location,
  emailLabel: "Email",
  email: profile.email,
  copyrightName: profile.name,
  copyrightSuffix: "All rights reserved.",
  builtWith: "Built with Next.js",
};
