export type SearchableProject = {
  category: string;
  title: string;
  technologies: readonly string[];
};

export type ProjectFilterOptions = {
  category?: string;
  query?: string;
};

export function filterProjects<T extends SearchableProject>(
  projects: readonly T[],
  { category = "all", query = "" }: ProjectFilterOptions = {},
): T[] {
  const normalizedCategory = category.toLowerCase();
  const normalizedQuery = query.trim().toLowerCase();

  return projects.filter((project) => {
    const matchesCategory =
      normalizedCategory === "all" ||
      project.category.toLowerCase() === normalizedCategory;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      project.title.toLowerCase().includes(normalizedQuery) ||
      project.technologies.some((technology) =>
        technology.toLowerCase().includes(normalizedQuery),
      );

    return matchesCategory && matchesQuery;
  });
}
