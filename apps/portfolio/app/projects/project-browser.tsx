"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { portfolioCopy, projectFilters, projects } from "@repo/content";
import { filterProjects } from "@repo/lib";
import { Badge, Button, Card, Tag } from "@repo/ui";

export default function ProjectBrowser() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "all";
  const queryParam = searchParams.get("q") ?? "";
  const activeCategory = projectFilters.some(
    (filter) => filter.value === categoryParam,
  )
    ? categoryParam
    : "all";
  const [queryInput, setQueryInput] = useState(queryParam);

  useEffect(() => {
    setQueryInput(queryParam);
  }, [queryParam]);

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }

    const queryString = params.toString();
    const href = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(href, { scroll: false });
  };

  const filteredProjects = filterProjects(projects, {
    category: activeCategory,
    query: queryParam,
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <form
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
          onSubmit={(event) => {
            event.preventDefault();
            const query = queryInput.trim();

            if (query !== queryParam) {
              updateUrl({ q: query || null });
            }
          }}
        >
          <div className="w-full md:max-w-md">
            <label className="mb-2 block font-medium" htmlFor="project-search">
              {portfolioCopy.projectSearchLabel}
            </label>
            <input
              className="border-border bg-surface-raised text-ink placeholder:text-muted focus-visible:outline-focus min-h-11 w-full rounded-md border px-4 focus-visible:outline-2 focus-visible:outline-offset-2"
              id="project-search"
              onChange={(event) => setQueryInput(event.currentTarget.value)}
              placeholder={portfolioCopy.projectSearchPlaceholder}
              type="search"
              value={queryInput}
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
          {projectFilters.map((filter) => (
            <Button
              key={filter.value}
              aria-pressed={activeCategory === filter.value}
              onClick={() => {
                if (activeCategory !== filter.value) {
                  updateUrl({
                    category: filter.value === "all" ? null : filter.value,
                  });
                }
              }}
              size="sm"
              type="button"
              variant={activeCategory === filter.value ? "primary" : "outline"}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      <p aria-atomic="true" aria-live="polite" className="text-muted">
        {filteredProjects.length}{" "}
        {filteredProjects.length === 1
          ? portfolioCopy.projectResultsSingular
          : portfolioCopy.projectResultsPlural}
      </p>

      {filteredProjects.length > 0 ? (
        <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => {
            const categoryLabel = projectFilters.find(
              (filter) => filter.value === project.category,
            )?.label;

            if (!categoryLabel) {
              throw new Error(
                `Missing filter label for project category "${project.category}"`,
              );
            }

            return (
              <li key={project.slug}>
                <Card className="flex h-full flex-col overflow-hidden p-0">
                  <Link
                    aria-label={`${project.title}: view project details`}
                    className="focus-visible:outline-focus relative block aspect-video w-full focus-visible:outline-2 focus-visible:outline-offset-2"
                    href={`/projects/${project.slug}`}
                  >
                    <Image
                      alt={`${project.title} ${portfolioCopy.projectPreviewAlt}`}
                      className="object-cover"
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                      src={project.image}
                    />
                  </Link>
                  <div className="p-card flex flex-1 flex-col">
                    <div className="flex flex-wrap gap-2">
                      <Badge>{categoryLabel}</Badge>
                      {project.featured ? (
                        <Badge variant="accent">
                          {portfolioCopy.featuredLabel}
                        </Badge>
                      ) : null}
                    </div>
                    <h2 className="mt-4 text-xl font-semibold">
                      <Link
                        className="hover:text-primary-hover focus-visible:outline-focus focus-visible:outline-2 focus-visible:outline-offset-4"
                        href={`/projects/${project.slug}`}
                      >
                        {project.title}
                      </Link>
                    </h2>
                    <p className="text-muted mt-2">{project.description}</p>
                    <ul
                      aria-label={project.title}
                      className="mt-4 flex flex-wrap gap-2"
                    >
                      {project.technologies.map((technology) => (
                        <li key={technology}>
                          <Tag>{technology}</Tag>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex flex-wrap gap-3 pt-6">
                      {project.demoUrl ? (
                        <Button
                          href={project.demoUrl}
                          rel="noreferrer noopener"
                          size="sm"
                          target="_blank"
                          variant="outline"
                        >
                          {portfolioCopy.liveDemoLabel}
                        </Button>
                      ) : null}
                      <Button
                        href={project.codeUrl}
                        rel="noreferrer noopener"
                        size="sm"
                        target="_blank"
                        variant="ghost"
                      >
                        {portfolioCopy.codeLabel}
                      </Button>
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
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
