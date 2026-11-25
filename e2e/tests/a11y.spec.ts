import { test } from "@playwright/test";
import { projects } from "@repo/content";
import { expectNoAxeViolations } from "./fixtures";

const pages = [
  { name: "home", path: "/" },
  { name: "projects", path: "/projects" },
  { name: "project detail", path: `/projects/${projects[0]!.slug}` },
  { name: "resume", path: "/resume" },
  { name: "404", path: "/this-page-does-not-exist" },
];

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`axe (${colorScheme} theme)`, () => {
    test.use({ colorScheme, reducedMotion: "reduce" });

    for (const { name, path } of pages) {
      test(`${name} has no detectable WCAG violations`, async ({ page }) => {
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        await expectNoAxeViolations(page);
      });
    }
  });
}

test.describe("axe (mobile menu open) @mobile", () => {
  test("open mobile menu has no violations", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /open navigation/i }).click();
    await expectNoAxeViolations(page);
  });
});
