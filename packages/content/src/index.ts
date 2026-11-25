export const siteContent = {
  title: "Portfolio",
  description: "Selected work and experience across product and software.",
  eyebrow: "Independent designer and developer",
  callToAction: "Explore selected work",
  projectsHeading: "Selected projects",
} as const;

export type ProjectContent = {
  title: string;
  description: string;
  startYear: number;
  endYear?: number;
};

export const projects: readonly ProjectContent[] = [
  {
    title: "Portfolio Platform",
    description:
      "A fast, accessible platform for presenting projects and experience.",
    startYear: 2026,
  },
  {
    title: "Design System",
    description:
      "A reusable component foundation for consistent product experiences.",
    startYear: 2025,
    endYear: 2026,
  },
] as const;

export const designSystemContent = {
  title: "Design System Preview",
  description:
    "Temporary reference page for reviewing shared components in both color themes.",
  themes: {
    light: "Light theme",
    dark: "Dark theme",
  },
  sectionHeading: "Shared components",
  sectionDescription:
    "Component examples use the same accessible tokens in both themes.",
  buttonsHeading: "Buttons",
  buttonLabels: {
    primary: "Primary action",
    outline: "Outline action",
    ghost: "Ghost action",
    link: "Link button",
    small: "Small",
    medium: "Medium",
    large: "Large",
  },
  cardHeading: "Card",
  cardDescription:
    "A raised surface with a readable border, typography, and shadow.",
  badgeHeading: "Badges",
  badgeLabels: {
    neutral: "Neutral",
    primary: "Primary",
    accent: "Accent",
  },
  tagHeading: "Tags",
  tagLabels: ["Design", "Accessibility", "Multi-Zones"],
  themeToggle: {
    light: "Switch to light theme",
    dark: "Switch to dark theme",
  },
  skipLinkLabel: "Skip to component examples",
  visuallyHiddenButtonLabel: "Screen-reader-only helper text",
  visibleButtonLabel: "Button with a hidden accessible label",
} as const;
