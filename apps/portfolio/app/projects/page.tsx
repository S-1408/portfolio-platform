import type { Metadata } from "next";
import { Suspense } from "react";
import { portfolioCopy } from "@repo/content";
import { createPageMetadata } from "@repo/lib";
import { Container, Section } from "@repo/ui";
import { siteConfig } from "../_seo/site";
import ProjectBrowser from "./project-browser";

export const metadata: Metadata = createPageMetadata(siteConfig, {
  title: portfolioCopy.projectsPageTitle,
  description: portfolioCopy.projectsPageDescription,
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <Container className="py-section">
      <Section
        id="projects-page"
        heading={portfolioCopy.projectsPageTitle}
        description={portfolioCopy.projectsPageDescription}
      >
        <Suspense
          fallback={
            <p aria-live="polite" className="text-muted">
              {portfolioCopy.projectsLoadingLabel}
            </p>
          }
        >
          <ProjectBrowser />
        </Suspense>
      </Section>
    </Container>
  );
}
