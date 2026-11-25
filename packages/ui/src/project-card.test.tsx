import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectCard, type ProjectCardProps } from "./project-card.js";

const labels: ProjectCardProps["labels"] = {
  featured: "Featured",
  liveDemo: "Live Demo",
  code: "View Code",
  previewAlt: "project preview",
  technologies: "technologies",
};

const project = {
  slug: "movie-browser",
  title: "Movie Browser",
  image: "/projects/nextjs/movie-browser.png",
  description: "Browse movies with the TMDB API.",
  technologies: ["Next.js", "TypeScript"],
  demoUrl: "https://example.com/demo",
  codeUrl: "https://github.com/example/movie-browser",
  featured: true,
};

function renderCard(overrides: Partial<ProjectCardProps> = {}) {
  return render(
    <ProjectCard
      project={project}
      categoryLabel="Next.js"
      labels={labels}
      {...overrides}
    />,
  );
}

describe("ProjectCard", () => {
  it("renders the title as an h3 link to the detail page by default", () => {
    renderCard();

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("Movie Browser");
    expect(
      within(heading).getByRole("link", { name: "Movie Browser" }),
    ).toHaveAttribute("href", "/projects/movie-browser");
  });

  it("supports a custom heading level for the page outline", () => {
    renderCard({ headingLevel: 2 });

    expect(
      screen.getByRole("heading", { level: 2, name: "Movie Browser" }),
    ).toBeInTheDocument();
  });

  it("has exactly one link to the detail page (no duplicate image link)", () => {
    renderCard();

    const detailLinks = screen
      .getAllByRole("link")
      .filter(
        (link) => link.getAttribute("href") === "/projects/movie-browser",
      );
    expect(detailLinks).toHaveLength(1);
  });

  it("gives the preview image descriptive alt text", () => {
    renderCard();

    expect(
      screen.getByRole("img", { name: "Movie Browser project preview" }),
    ).toHaveAttribute("src", project.image);
  });

  it("lazy-loads the image unless prioritized for LCP", () => {
    const { unmount } = renderCard();
    expect(screen.getByRole("img")).not.toHaveAttribute("loading", "eager");
    unmount();

    renderCard({ prioritizeImage: true });
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("loading", "eager");
    expect(image).toHaveAttribute("fetchpriority", "high");
  });

  it("shows category, featured badge and technologies", () => {
    renderCard();

    expect(screen.getByText("Featured")).toBeInTheDocument();
    const techList = screen.getByRole("list", {
      name: "Movie Browser technologies",
    });
    expect(
      within(techList)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual(["Next.js", "TypeScript"]);
  });

  it("labels external links with the project name and opens them safely", () => {
    renderCard();

    const demo = screen.getByRole("link", { name: "Live Demo: Movie Browser" });
    const code = screen.getByRole("link", { name: "View Code: Movie Browser" });

    expect(demo).toHaveAttribute("href", project.demoUrl);
    expect(code).toHaveAttribute("href", project.codeUrl);
    for (const link of [demo, code]) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer noopener");
    }
  });

  it("omits the featured badge and demo link when not provided", () => {
    renderCard({
      project: { ...project, featured: false, demoUrl: undefined },
    });

    expect(screen.queryByText("Featured")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Live Demo/ }),
    ).not.toBeInTheDocument();
  });
});
