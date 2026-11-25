import { expect, test } from "@playwright/test";
import { headerLabels } from "@repo/content";

test.use({ colorScheme: "light" });

test("theme toggle switches theme and persists across reloads", async ({
  page,
}) => {
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "light");

  const banner = page.getByRole("banner");
  await banner
    .getByRole("button", { name: headerLabels.themeToggleLabels.dark })
    .click();

  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(
    banner.getByRole("button", { name: headerLabels.themeToggleLabels.light }),
  ).toBeVisible();

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "dark");

  // Persists across navigation to other routes too.
  await page.goto("/projects");
  await expect(html).toHaveAttribute("data-theme", "dark");
});
