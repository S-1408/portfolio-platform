import type { Experience } from "./types.js";

export const experience: readonly Experience[] = [
  {
    company: "GlobalLogic India Pvt. Ltd.",
    role: "Senior Software Engineer",
    start: "Sep 2025",
    end: "Jun 2026",
    client: "Hitachi Building Systems",
    summary:
      "Frontend React Developer for Hitachi Building Systems' Building Management System.",
    bullets: [
      "Built the Energy module, reusable accessible components, and REST API integrations.",
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Axios", "React Query"],
  },
  {
    company: "SmartGig Technology Pvt. Ltd.",
    role: "Software Engineer",
    start: "Oct 2021",
    end: "Jul 2025",
    client: "Mercedes-Benz Research and Development India (MBRDI)",
    summary:
      "Built and maintained GTMx for Mercedes-Benz Research and Development India (MBRDI).",
    bullets: [
      "Implemented RBAC, reusable responsive components, REST API integrations, internationalization, and Rematch state management.",
    ],
    techStack: ["REST APIs", "Rematch"],
  },
];
