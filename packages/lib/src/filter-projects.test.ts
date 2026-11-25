import { describe, expect, it } from "vitest";
import { filterProjects } from "./filter-projects.js";

const projects = [
  {
    title: "Movie Browser",
    category: "nextjs",
    technologies: ["Next.js", "TypeScript", "TMDB API"],
  },
  {
    title: "JobTrackr",
    category: "react",
    technologies: ["React", "JavaScript"],
  },
  {
    title: "Task Manager",
    category: "angular",
    technologies: ["Angular", "TypeScript"],
  },
] as const;

describe("filterProjects", () => {
  it("returns all projects when no filters are provided", () => {
    expect(filterProjects(projects)).toEqual(projects);
  });

  it("filters by category", () => {
    expect(filterProjects(projects, { category: "react" })).toEqual([
      projects[1],
    ]);
  });

  it("matches the title or technologies without case sensitivity", () => {
    expect(filterProjects(projects, { query: "MOVIE" })).toEqual([projects[0]]);
    expect(filterProjects(projects, { query: "typescript" })).toEqual([
      projects[0],
      projects[2],
    ]);
  });

  it("applies category and query together", () => {
    expect(
      filterProjects(projects, { category: "react", query: "javascript" }),
    ).toEqual([projects[1]]);
    expect(
      filterProjects(projects, { category: "react", query: "angular" }),
    ).toEqual([]);
  });

  it("treats a blank query as no search filter", () => {
    expect(filterProjects(projects, { query: "   " })).toEqual(projects);
  });
});
