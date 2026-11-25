"use client";

import { useEffect, useRef } from "react";
import { errorPageContent } from "@repo/content";
import { Button } from "@repo/ui";

type ErrorFallbackProps = {
  error: unknown;
  retry: () => void;
};

function getDigest(error: unknown) {
  if (error && typeof error === "object" && "digest" in error) {
    const { digest } = error as { digest?: unknown };
    return typeof digest === "string" ? digest : undefined;
  }

  return undefined;
}

/** Shared fallback UI for error.tsx and global-error.tsx. */
export function ErrorFallback({ error, retry }: ErrorFallbackProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const digest = getDigest(error);

  useEffect(() => {
    console.error(error);
    // Move focus so keyboard and screen reader users land on the new content.
    headingRef.current?.focus();
  }, [error]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 py-16 text-center">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-3xl font-bold tracking-tight focus:outline-none sm:text-4xl"
      >
        {errorPageContent.heading}
      </h1>
      <p className="text-muted text-lg leading-8">
        {errorPageContent.description}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={() => retry()}>{errorPageContent.retryLabel}</Button>
        <Button href="/" variant="outline">
          {errorPageContent.homeLabel}
        </Button>
      </div>
      {digest ? (
        <p className="text-muted text-sm">
          {errorPageContent.referenceLabel}: <code>{digest}</code>
        </p>
      ) : null}
    </div>
  );
}
