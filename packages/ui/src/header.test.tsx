import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Header, type HeaderProps } from "./header.js";

const labels: HeaderProps["labels"] = {
  navigationLabel: "Primary navigation",
  mobileMenuLabel: "Site navigation",
  openMenuLabel: "Open navigation menu",
  closeMenuLabel: "Close navigation menu",
  themeToggleLabels: {
    light: "Switch to light theme",
    dark: "Switch to dark theme",
  },
};

const navItems: HeaderProps["navItems"] = [
  { id: "home", label: "Home", href: "/", sectionId: "home" },
  {
    id: "projects",
    label: "Projects",
    href: "/#projects",
    sectionId: "projects",
  },
  { id: "blog", label: "Blog", href: "/blog", crossZone: true },
  { id: "resume", label: "Resume", href: "/resume" },
];

function renderHeader() {
  const user = userEvent.setup();
  render(
    <Header
      navItems={navItems}
      logoSrc="/images/sv.png"
      logoAlt="Jane Doe"
      labels={labels}
    />,
  );
  const trigger = screen.getByRole("button", { name: labels.openMenuLabel });

  return { user, trigger };
}

describe("Header", () => {
  it("renders the logo link and desktop navigation", () => {
    renderHeader();

    expect(screen.getByRole("link", { name: "Jane Doe" })).toHaveAttribute(
      "href",
      "/",
    );
    const nav = screen.getByRole("navigation", {
      name: labels.navigationLabel,
    });
    expect(within(nav).getAllByRole("link")).toHaveLength(navItems.length);
  });

  it("uses a plain anchor for cross-zone links", () => {
    renderHeader();

    const nav = screen.getByRole("navigation", {
      name: labels.navigationLabel,
    });
    expect(within(nav).getByRole("link", { name: "Blog" })).toHaveAttribute(
      "href",
      "/blog",
    );
  });

  describe("mobile menu", () => {
    it("starts closed", () => {
      const { trigger } = renderHeader();

      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveAttribute("aria-controls", "mobile-navigation");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("opens as a modal dialog, focuses close and locks scrolling", async () => {
      const { user, trigger } = renderHeader();

      await user.click(trigger);

      const dialog = screen.getByRole("dialog", {
        name: labels.mobileMenuLabel,
      });
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAccessibleName(labels.closeMenuLabel);
      expect(
        within(dialog).getByRole("button", { name: labels.closeMenuLabel }),
      ).toHaveFocus();
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("traps Tab and Shift+Tab inside the dialog", async () => {
      const { user, trigger } = renderHeader();
      await user.click(trigger);

      const dialog = screen.getByRole("dialog");
      const closeButton = within(dialog).getByRole("button", {
        name: labels.closeMenuLabel,
      });
      const themeToggle = within(dialog).getByRole("button", {
        name: /switch to/i,
      });

      // Wrap backwards from the first control to the last.
      await user.tab({ shift: true });
      expect(themeToggle).toHaveFocus();

      // And forwards from the last back to the first.
      await user.tab();
      expect(closeButton).toHaveFocus();

      // Tabbing through the whole dialog never escapes it.
      const stops = within(dialog).getAllByRole("link").length + 2;
      for (let index = 0; index < stops; index += 1) {
        await user.tab();
        expect(dialog).toContainElement(document.activeElement as HTMLElement);
      }
    });

    it("closes on Escape, restores focus and unlocks scrolling", async () => {
      const { user, trigger } = renderHeader();
      await user.click(trigger);

      await user.keyboard("{Escape}");

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveFocus();
      expect(document.body.style.overflow).toBe("");
    });

    it("closes from the close button", async () => {
      const { user, trigger } = renderHeader();
      await user.click(trigger);

      await user.click(
        within(screen.getByRole("dialog")).getByRole("button", {
          name: labels.closeMenuLabel,
        }),
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });

    it("closes after choosing a navigation link", async () => {
      const { user, trigger } = renderHeader();
      await user.click(trigger);

      await user.click(
        within(screen.getByRole("dialog")).getByRole("link", {
          name: "Projects",
        }),
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("can be operated entirely from the keyboard", async () => {
      const { user, trigger } = renderHeader();

      trigger.focus();
      await user.keyboard("{Enter}");
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      await user.keyboard("{Escape}");
      expect(trigger).toHaveFocus();

      await user.keyboard(" ");
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });
});
