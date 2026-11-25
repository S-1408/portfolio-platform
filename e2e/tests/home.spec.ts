import { expect, test } from "@playwright/test";
import { navigationItems, portfolioCopy, profile } from "@repo/content";

test.describe("home page", () => {
  test("loads with landmarks and the main heading", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(new RegExp(profile.name));
    await expect(
      page.getByRole("heading", { level: 1, name: profile.name }),
    ).toBeVisible();
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("skip link moves focus to the main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const skipLink = page.getByRole("link", {
      name: portfolioCopy.skipToContentLabel,
    });
    await expect(skipLink).toBeFocused();
    await skipLink.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });

  for (const item of navigationItems.filter(
    (navItem) => navItem.sectionId && navItem.id !== "home",
  )) {
    test(`"${item.label}" nav link scrolls to its section`, async ({
      page,
    }) => {
      await page.goto("/");
      const nav = page.getByRole("navigation", { name: /primary/i });

      await nav.getByRole("link", { name: item.label, exact: true }).click();

      await expect(page).toHaveURL(new RegExp(`#${item.sectionId}$`));
      await expect(page.locator(`#${item.sectionId}`)).toBeInViewport();
      await expect(
        nav.getByRole("link", { name: item.label, exact: true }),
      ).toHaveAttribute("aria-current", "location");
    });
  }
});
