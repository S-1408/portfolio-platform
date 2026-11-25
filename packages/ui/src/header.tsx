"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./theme-toggle.js";

export type HeaderNavItem = {
  id: string;
  label: string;
  href: string;
  sectionId?: string;
  crossZone?: boolean;
  download?: boolean;
};

export type HeaderProps = {
  navItems: readonly HeaderNavItem[];
  logoSrc: string;
  logoAlt: string;
  labels: {
    navigationLabel: string;
    mobileMenuLabel: string;
    openMenuLabel: string;
    closeMenuLabel: string;
    themeToggleLabels: {
      light: string;
      dark: string;
    };
  };
};

type NavLinkProps = {
  item: HeaderNavItem;
  active: boolean;
  onNavigate?: () => void;
};

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function NavLink({ item, active, onNavigate }: NavLinkProps) {
  const className = `inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
    active
      ? "border-accent/20 bg-accent-surface text-accent"
      : "border-transparent text-muted hover:bg-surface hover:text-accent"
  }`;
  const ariaCurrent = active ? "location" : undefined;

  if (item.crossZone || item.download) {
    return (
      <a
        className={className}
        href={item.href}
        aria-current={ariaCurrent}
        download={item.download}
        onClick={onNavigate}
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link
      className={className}
      href={item.href}
      aria-current={ariaCurrent}
      onClick={onNavigate}
    >
      {item.label}
    </Link>
  );
}

export function Header({ navItems, logoSrc, logoAlt, labels }: HeaderProps) {
  const homeItem = navItems.find((item) => item.id === "home");
  const [activeItemId, setActiveItemId] = useState(homeItem?.id ?? "");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (window.location.pathname !== "/") {
      const currentItem = navItems.find(
        (item) =>
          !item.crossZone &&
          !item.download &&
          item.href.split("#")[0] === window.location.pathname,
      );
      setActiveItemId(currentItem?.id ?? "");
      return;
    }

    const home = navItems.find((item) => item.id === "home");
    const sectionItems = navItems.filter((item) => item.sectionId);
    const sections = sectionItems
      .map((item) => ({
        item,
        element: document.getElementById(item.sectionId ?? ""),
      }))
      .filter(
        (
          entry,
        ): entry is {
          item: HeaderNavItem;
          element: HTMLElement;
        } => entry.element !== null,
      );

    setActiveItemId(home?.id ?? "");

    if (sections.length === 0 || !("IntersectionObserver" in window)) {
      return;
    }

    const sectionItemsById = new Map(
      sections.map(({ item, element }) => [element.id, item.id]),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) =>
              left.boundingClientRect.top - right.boundingClientRect.top,
          )[0];

        if (visibleEntry) {
          setActiveItemId(
            sectionItemsById.get(visibleEntry.target.id) ?? home?.id ?? "",
          );
        } else if (window.scrollY < 120) {
          setActiveItemId(home?.id ?? "");
        }
      },
      {
        rootMargin: "-18% 0px -68% 0px",
        threshold: 0,
      },
    );

    sections.forEach(({ element }) => observer.observe(element));

    return () => observer.disconnect();
  }, [navItems]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const panel = mobileMenuRef.current;

    if (!panel) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const desktopMedia = window.matchMedia("(min-width: 768px)");
    document.body.style.overflow = "hidden";

    const closeButton = panel.querySelector<HTMLElement>(
      "[data-mobile-menu-close]",
    );
    closeButton?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileMenuOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = Array.from(
        panel.querySelectorAll<HTMLElement>(focusableSelector),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        event.preventDefault();
        return;
      }

      if (!panel.contains(document.activeElement)) {
        event.preventDefault();
        firstElement.focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const handleDesktopResize = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    desktopMedia.addEventListener("change", handleDesktopResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      desktopMedia.removeEventListener("change", handleDesktopResize);

      if (!desktopMedia.matches) {
        menuTriggerRef.current?.focus();
      }
    };
  }, [mobileMenuOpen]);

  const handleMobileNavigation = () => setMobileMenuOpen(false);

  return (
    <header className="border-border bg-background/90 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="px-page-x mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4">
        <Link
          className="focus-visible:outline-focus inline-flex shrink-0 overflow-hidden rounded-full transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2"
          href="/"
          aria-label={logoAlt}
        >
          <Image
            src={logoSrc}
            alt=""
            width={48}
            height={48}
            priority
            className="size-10 rounded-full object-contain"
          />
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label={labels.navigationLabel}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              item={item}
              active={item.id === activeItemId}
            />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <ThemeToggle labels={labels.themeToggleLabels} />
          <button
            ref={menuTriggerRef}
            type="button"
            className="border-border bg-surface-raised text-ink focus-visible:outline-focus inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border focus-visible:outline-2 focus-visible:outline-offset-2 md:hidden"
            aria-label={
              mobileMenuOpen ? labels.closeMenuLabel : labels.openMenuLabel
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              className="size-5"
            >
              {mobileMenuOpen ? (
                <path d="m6 6 12 12M18 6 6 18" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        ref={mobileMenuRef}
        hidden={!mobileMenuOpen}
        className="bg-ink/50 fixed inset-0 z-50 md:hidden"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setMobileMenuOpen(false);
          }
        }}
      >
        <div
          className="bg-background text-ink shadow-raised ml-auto flex h-full w-[min(22rem,88vw)] flex-col gap-6 overflow-y-auto p-6"
          role="dialog"
          aria-modal="true"
          aria-label={labels.mobileMenuLabel}
        >
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold">{labels.mobileMenuLabel}</span>
            <button
              type="button"
              data-mobile-menu-close
              className="border-border bg-surface-raised text-ink focus-visible:outline-focus inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-label={labels.closeMenuLabel}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                className="size-5"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <nav
            className="flex flex-col items-stretch gap-2"
            aria-label={labels.navigationLabel}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                item={item}
                active={item.id === activeItemId}
                onNavigate={handleMobileNavigation}
              />
            ))}
          </nav>

          <ThemeToggle labels={labels.themeToggleLabels} />
        </div>
      </div>
    </header>
  );
}
