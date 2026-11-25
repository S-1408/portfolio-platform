"use client";

import { useEffect } from "react";
import { errorPageContent } from "@repo/content";
import { Container } from "@repo/ui";
import { ErrorFallback } from "./_seo/error-fallback";
import "./globals.css";

/** Mirrors next-themes' stored choice, since the root layout isn't rendered here. */
function useStoredTheme() {
  useEffect(() => {
    let theme: string | null = null;

    try {
      theme = window.localStorage.getItem("theme");
    } catch {
      // Storage can be unavailable (private mode, blocked cookies).
    }

    const resolved =
      theme === "light" || theme === "dark"
        ? theme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    document.documentElement.dataset.theme = resolved;
  }, []);
}

export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useStoredTheme();

  return (
    <html lang="en">
      <body className="bg-background text-ink min-h-screen font-sans">
        <title>{errorPageContent.title}</title>
        <main>
          <Container className="py-section">
            <ErrorFallback error={error} retry={retry} />
          </Container>
        </main>
      </body>
    </html>
  );
}
