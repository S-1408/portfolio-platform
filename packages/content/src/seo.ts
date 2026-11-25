import { profile } from "./profile.js";
import type { ErrorPageContent, NotFoundContent, SeoContent } from "./types.js";

export const seoContent: SeoContent = {
  siteName: profile.name,
  titleTemplate: `%s | ${profile.name}`,
  defaultTitle: `${profile.name} | ${profile.role}`,
  description: `${profile.name} is a ${profile.role} specializing in React.js, Next.js and TypeScript.`,
  keywords: [
    profile.name,
    profile.role,
    "React Developer",
    "Next.js",
    "TypeScript",
    "portfolio",
  ],
  locale: "en_IN",
  addressLocality: "Bengaluru",
  addressCountry: "IN",
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Accessibility",
    "Frontend performance",
  ],
  homeOgAlt: `${profile.name}, ${profile.role}`,
  projectOgAltSuffix: `project by ${profile.name}`,
  manifest: {
    name: `${profile.name} | ${profile.role}`,
    shortName: profile.name,
    backgroundColor: "#f8f7f3",
    themeColor: "#00c6bc",
    darkThemeColor: "#10201f",
  },
};

export const notFoundContent: NotFoundContent = {
  title: "Page not found",
  code: "404",
  heading: "Oops! This page isn't available.",
  description:
    "The page you're looking for may have moved or no longer exists. Sorry for the inconvenience.",
  homeLabel: "Back to home",
  projectsLabel: "Browse projects",
};

export const errorPageContent: ErrorPageContent = {
  title: "Something went wrong",
  heading: "Something went wrong",
  description:
    "An unexpected error stopped this page from loading. Please try again, or head back to the home page.",
  retryLabel: "Try again",
  homeLabel: "Back to home",
  referenceLabel: "Error reference",
};
