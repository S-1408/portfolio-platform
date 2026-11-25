import { expect, test } from "@playwright/test";
import { headerLabels } from "@repo/content";

test.describe("mobile navigation @mobile", () => {
  test("opens, traps focus, closes with Escape and restores focus", async ({
    page,
  }) => {
    await page.goto("/");
    // The trigger's accessible name flips between open/close, so locate it
    // by the element it controls.
    const trigger = page.locator('button[aria-controls="mobile-navigation"]');
    await expect(trigger).toHaveAccessibleName(headerLabels.openMenuLabel);

    await trigger.focus();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog", {
      name: headerLabels.mobileMenuLabel,
    });
    await expect(dialog).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    const close = dialog.getByRole("button", {
      name: headerLabels.closeMenuLabel,
    });
    await expect(close).toBeFocused();

    // Shift+Tab from the first control wraps to the last one inside the dialog.
    await page.keyboard.press("Shift+Tab");
    const focusedInDialog = await dialog.evaluate((element) =>
      element.contains(document.activeElement),
    );
    expect(focusedInDialog).toBe(true);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("navigating from the menu closes it and scrolls", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("button", { name: headerLabels.openMenuLabel })
      .click();

    const dialog = page.getByRole("dialog", {
      name: headerLabels.mobileMenuLabel,
    });
    await dialog.getByRole("link", { name: "Contact", exact: true }).click();

    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator("#contact")).toBeInViewport();
  });
});
