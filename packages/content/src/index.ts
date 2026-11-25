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
