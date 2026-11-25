"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export type ThemeToggleProps = {
  labels: {
    light: string;
    dark: string;
  };
};

export function ThemeToggle({ labels }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const label = isDark ? labels.light : labels.dark;

  return (
    <button
      type="button"
      aria-label={label}
      disabled={!mounted}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-pill border-border bg-surface-raised text-ink hover:bg-surface focus-visible:outline-focus inline-flex min-h-11 min-w-11 items-center justify-center border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        className="size-5"
      >
        {isDark ? (
          <circle cx="12" cy="12" r="4" />
        ) : (
          <path d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z" />
        )}
      </svg>
    </button>
  );
}
