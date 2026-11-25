import type { Metadata } from "next";
import { notFoundContent } from "@repo/content";
import { Button, Container } from "@repo/ui";

// Next.js adds `noindex` to 404 responses automatically.
export const metadata: Metadata = {
  title: notFoundContent.title,
};

export default function NotFound() {
  return (
    <Container className="py-section">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <p
          aria-hidden="true"
          className="text-primary text-8xl font-bold tracking-tight sm:text-9xl"
        >
          {notFoundContent.code}
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {notFoundContent.heading}
        </h1>
        <p className="text-muted text-lg leading-8">
          {notFoundContent.description}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/">{notFoundContent.homeLabel}</Button>
          <Button href="/projects" variant="outline">
            {notFoundContent.projectsLabel}
          </Button>
        </div>
      </div>
    </Container>
  );
}
