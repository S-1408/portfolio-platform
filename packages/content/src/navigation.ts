import type { HeaderLabels, NavigationItem } from "./types.js";

export const navigationItems: readonly NavigationItem[] = [
  { id: "home", label: "Home", href: "/", sectionId: "home" },
  { id: "about", label: "About", href: "/#about", sectionId: "about" },
  {
    id: "projects",
    label: "Projects",
    href: "/#projects",
    sectionId: "projects",
  },
  { id: "contact", label: "Contact", href: "/#contact", sectionId: "contact" },
  { id: "blog", label: "Blog", href: "/blog", crossZone: true },
  { id: "resume", label: "Resume", href: "/resume" },
];

export const headerLabels: HeaderLabels = {
  navigationLabel: "Primary navigation",
  mobileMenuLabel: "Site navigation",
  openMenuLabel: "Open navigation menu",
  closeMenuLabel: "Close navigation menu",
  themeToggleLabels: {
    light: "Switch to light theme",
    dark: "Switch to dark theme",
  },
};
