import type { SkillGroup } from "./types.js";

export const skillGroups: readonly SkillGroup[] = [
  {
    number: 1,
    title: "Frontend Development",
    skills: [
      "React.js",
      "Next.js",
      "JavaScript",
      "TypeScript",
      "HTML5",
      "CSS3",
    ],
  },
  {
    number: 2,
    title: "UI & Styling",
    skills: [
      "Tailwind CSS",
      "Material UI",
      "Bootstrap",
      "Responsive & Accessible UI",
    ],
  },
  {
    number: 3,
    title: "State & Data",
    skills: [
      "Redux Toolkit",
      "Rematch",
      "React Query",
      "SWR",
      "REST APIs",
      "Axios",
    ],
  },
  {
    number: 4,
    title: "Quality & Testing",
    skills: [
      "Vitest",
      "Jest",
      "React Testing Library",
      "MSW",
      "WCAG Accessibility",
    ],
  },
  {
    number: 5,
    title: "Tools & Workflow",
    skills: [
      "Git",
      "GitHub",
      "Vite",
      "Monorepos",
      "i18n",
      "Agile Collaboration",
    ],
  },
];
