"use client";

import { Container } from "@repo/ui";
import { ErrorFallback } from "./_seo/error-fallback";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <Container className="py-section">
      <ErrorFallback error={error} retry={retry} />
    </Container>
  );
}
