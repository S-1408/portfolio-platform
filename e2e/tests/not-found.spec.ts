import { expect, test } from "@playwright/test";
import { notFoundContent } from "@repo/content";

test("unknown routes render the branded 404 page", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");

  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle(new RegExp(notFoundContent.title));
  await expect(
    page.getByRole("heading", { level: 1, name: notFoundContent.heading }),
  ).toBeVisible();

  await page
    .getByRole("main")
    .getByRole("link", { name: notFoundContent.projectsLabel })
    .click();
  await expect(page).toHaveURL(/\/projects$/);

  await page.goBack();
  await page
    .getByRole("main")
    .getByRole("link", { name: notFoundContent.homeLabel })
    .click();
  await expect(page).toHaveURL(/\/$/);
});

test("unknown project slugs return 404", async ({ page }) => {
  const response = await page.goto("/projects/not-a-real-project");

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { level: 1, name: notFoundContent.heading }),
  ).toBeVisible();
});
