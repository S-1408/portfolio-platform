import type { Metadata } from "next";
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
        headingLevel={1}
        description={portfolioCopy.projectsPageDescription}
      >
        {/* Static HTML shows the unfiltered list; the client applies the URL
            filters after hydration (see use-url-search.ts). */}
        <ProjectBrowser />
      </Section>
    </Container>
  );
}
