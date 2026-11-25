"use client";

import { useEffect, useState } from "react";
import { portfolioCopy, projectFilters, projects } from "@repo/content";
import {
  buildProjectSearchHref,
  filterProjects,
  parseProjectSearchParams,
  type ProjectSearchState,
} from "@repo/lib";
import { Button, ProjectCard } from "@repo/ui";
import {
  getProjectCategoryLabel,
  projectCardLabels,
} from "../_projects/project-display";
import { useUrlSearch } from "./use-url-search";

const validCategories = projectFilters.map((filter) => filter.value);

/** Interactive browser: state lives in the URL (?category=&q=). */
export default function ProjectBrowser() {
  const { searchParams, push } = useUrlSearch();
  const { category, query } = parseProjectSearchParams(
    searchParams,
    validCategories,
  );
  const [queryInput, setQueryInput] = useState(query);

  useEffect(() => {
    setQueryInput(query);
  }, [query]);

  const navigate = (updates: Partial<ProjectSearchState>) => {
    push(buildProjectSearchHref("/projects", searchParams, updates));
  };

  return (
    <ProjectBrowserView
      category={category}
      query={query}
      queryInput={queryInput}
      onQueryInputChange={setQueryInput}
      onSearch={(value) => {
        if (value.trim() !== query) navigate({ query: value });
      }}
      onCategoryChange={(value) => {
        if (value !== category) navigate({ category: value });
      }}
    />
  );
}

type ProjectBrowserViewProps = {
  category: string;
  query: string;
  queryInput: string;
  onQueryInputChange: (value: string) => void;
  onSearch: (value: string) => void;
  onCategoryChange: (category: string) => void;
};

// Cards in the first row hold the LCP image, so don't lazy-load them.
const EAGER_IMAGE_COUNT = 3;

function ProjectBrowserView({
  category,
  query,
  queryInput,
  onQueryInputChange,
  onSearch,
  onCategoryChange,
}: ProjectBrowserViewProps) {
  const filteredProjects = filterProjects(projects, { category, query });
  const count = filteredProjects.length;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <form
          role="search"
          action="/projects"
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch(queryInput);
          }}
        >
          <div className="w-full md:max-w-md">
            <label className="mb-2 block font-medium" htmlFor="project-search">
              {portfolioCopy.projectSearchLabel}
            </label>
            <input
              className="border-border bg-surface-raised text-ink placeholder:text-muted focus-visible:outline-focus min-h-11 w-full rounded-md border px-4 focus-visible:outline-2 focus-visible:outline-offset-2"
              id="project-search"
              name="q"
              placeholder={portfolioCopy.projectSearchPlaceholder}
              type="search"
              value={queryInput}
              onChange={(event) =>
                onQueryInputChange(event.currentTarget.value)
              }
            />
          </div>
          <Button type="submit" variant="outline">
            {portfolioCopy.searchProjectsLabel}
          </Button>
        </form>
        <div
          aria-label={portfolioCopy.projectFiltersLabel}
          className="flex flex-wrap gap-2"
          role="group"
        >
          {projectFilters.map((filter) => {
            const active = category === filter.value;

            return (
              <Button
                key={filter.value}
                aria-pressed={active}
                onClick={() => onCategoryChange(filter.value)}
                size="sm"
                type="button"
                variant={active ? "primary" : "outline"}
              >
                {filter.label}
              </Button>
            );
          })}
        </div>
      </div>

      <p role="status" aria-atomic="true" className="text-muted">
        {count}{" "}
        {count === 1
          ? portfolioCopy.projectResultsSingular
          : portfolioCopy.projectResultsPlural}
      </p>

      {count > 0 ? (
        <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <li key={project.slug}>
              <ProjectCard
                project={project}
                categoryLabel={getProjectCategoryLabel(project.category)}
                headingLevel={2}
                prioritizeImage={index < EAGER_IMAGE_COUNT}
                labels={projectCardLabels}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-border bg-surface-raised rounded-lg border p-8 text-center">
          <h2 className="text-xl font-semibold">
            {portfolioCopy.noProjectsFoundHeading}
          </h2>
          <p className="text-muted mt-2">
            {portfolioCopy.noProjectsFoundDescription}
          </p>
        </div>
      )}
    </div>
  );
}
