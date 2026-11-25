import { portfolioCopy, projectFilters } from "@repo/content";
import type { ProjectCategory } from "@repo/content";
import type { ProjectCardProps } from "@repo/ui";

export const projectCardLabels: ProjectCardProps["labels"] = {
  featured: portfolioCopy.featuredLabel,
  liveDemo: portfolioCopy.liveDemoLabel,
  code: portfolioCopy.codeLabel,
  previewAlt: portfolioCopy.projectPreviewAlt,
  technologies: portfolioCopy.projectTechnologiesHeading,
};

export function getProjectCategoryLabel(category: ProjectCategory) {
  const filter = projectFilters.find((item) => item.value === category);

  if (!filter) {
    throw new Error(`Missing filter label for project category "${category}"`);
  }

  return filter.label;
}
