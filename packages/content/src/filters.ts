import type { ProjectFilter } from "./types.js";

export const projectFilters: readonly ProjectFilter[] = [
  { label: "All", value: "all" },
  { label: "React", value: "react" },
  { label: "Angular", value: "angular" },
  { label: "Next.js", value: "nextjs" },
  { label: "JavaScript", value: "javascript" },
];
