import { expect, test, type Page } from "@playwright/test";
import { portfolioCopy, projectFilters, projects } from "@repo/content";

function resultsStatus(page: Page, count: number) {
  const label =
    count === 1
      ? portfolioCopy.projectResultsSingular
      : portfolioCopy.projectResultsPlural;

  return page.getByText(`${count} ${label}`, { exact: true });
}

function cardHeadings(page: Page) {
  return page.getByRole("main").getByRole("heading", { level: 2 });
}

test.describe("projects page", () => {
  test("category filter updates the URL and the results", async ({ page }) => {
    await page.goto("/projects");
    await expect(resultsStatus(page, projects.length)).toBeVisible();

    const filter = projectFilters.find((item) => item.value === "react");
    if (!filter) throw new Error("react filter missing from content");
    const expected = projects.filter((project) => project.category === "react");

    const group = page.getByRole("group", {
      name: portfolioCopy.projectFiltersLabel,
    });
    const button = group.getByRole("button", { name: filter.label });
    await button.click();

    await expect(page).toHaveURL(/\/projects\?category=react$/);
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(resultsStatus(page, expected.length)).toBeVisible();
    await expect(cardHeadings(page)).toHaveText(
      expected.map((project) => project.title),
    );

    // "All" clears the parameter again.
    await group.getByRole("button", { name: projectFilters[0]!.label }).click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(resultsStatus(page, projects.length)).toBeVisible();
  });

  test("browser back/forward restore filter state", async ({ page }) => {
    await page.goto("/projects");
    const group = page.getByRole("group", {
      name: portfolioCopy.projectFiltersLabel,
    });
    const angular = projectFilters.find((item) => item.value === "angular")!;
    const angularCount = projects.filter(
      (project) => project.category === "angular",
    ).length;

    await group.getByRole("button", { name: angular.label }).click();
    await expect(resultsStatus(page, angularCount)).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(resultsStatus(page, projects.length)).toBeVisible();

    await page.goForward();
    await expect(page).toHaveURL(/category=angular$/);
    await expect(resultsStatus(page, angularCount)).toBeVisible();
  });

  test("search updates the URL and narrows the results", async ({ page }) => {
    await page.goto("/projects");
    const query = "TypeScript";
    const expected = projects.filter(
      (project) =>
        project.title.toLowerCase().includes(query.toLowerCase()) ||
        project.technologies.some((tech) =>
          tech.toLowerCase().includes(query.toLowerCase()),
        ),
    );

    await page
      .getByRole("searchbox", { name: portfolioCopy.projectSearchLabel })
      .fill(query);
    await page
      .getByRole("button", { name: portfolioCopy.searchProjectsLabel })
      .click();

    await expect(page).toHaveURL(new RegExp(`[?&]q=${query}`));
    await expect(resultsStatus(page, expected.length)).toBeVisible();
  });

  test("filters are restored from the URL", async ({ page }) => {
    await page.goto("/projects?category=angular");
    const expected = projects.filter(
      (project) => project.category === "angular",
    );
    const label = projectFilters.find(
      (item) => item.value === "angular",
    )!.label;

    await expect(
      page.getByRole("button", { name: label, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(resultsStatus(page, expected.length)).toBeVisible();
  });

  test("shows an empty state when nothing matches", async ({ page }) => {
    await page.goto("/projects?q=zzzz-no-match");
    await expect(resultsStatus(page, 0)).toBeVisible();
    await expect(
      page.getByRole("heading", { name: portfolioCopy.noProjectsFoundHeading }),
    ).toBeVisible();
  });

  test("opens a project detail page", async ({ page }) => {
    const project = projects[0]!;
    await page.goto("/projects");

    await page
      .getByRole("main")
      .getByRole("link", { name: project.title, exact: true })
      .click();

    await expect(page).toHaveURL(new RegExp(`/projects/${project.slug}$`));
    await expect(
      page.getByRole("heading", { level: 1, name: project.title }),
    ).toBeVisible();
    await expect(page).toHaveTitle(new RegExp(project.title));

    await page
      .getByRole("link", { name: portfolioCopy.backToProjectsLabel })
      .click();
    await expect(page).toHaveURL(/\/projects$/);
  });
});
