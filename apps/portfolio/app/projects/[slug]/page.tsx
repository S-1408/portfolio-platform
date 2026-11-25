import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  portfolioCopy,
  projectFilters,
  projects,
  seoContent,
} from "@repo/content";
import { createPageMetadata } from "@repo/lib";
import { Badge, Button, Container, Section, Tag } from "@repo/ui";
import { siteConfig } from "../../_seo/site";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

function findProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);

  if (!project) {
    notFound();
  }

  return createPageMetadata(siteConfig, {
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
    openGraphType: "article",
    image: {
      // Served by ./opengraph-image.tsx.
      url: `/projects/${project.slug}/opengraph-image`,
      width: 1200,
      height: 630,
      alt: `${project.title}: ${seoContent.projectOgAltSuffix}`,
    },
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = findProject(slug);

  if (!project) {
    notFound();
  }

  const categoryLabel = projectFilters.find(
    (filter) => filter.value === project.category,
  )?.label;

  if (!categoryLabel) {
    throw new Error(
      `Missing filter label for project category "${project.category}"`,
    );
  }

  return (
    <Container className="py-section">
      <div className="space-y-8">
        <Button href="/projects" variant="outline">
          {portfolioCopy.backToProjectsLabel}
        </Button>
        <article className="space-y-8">
          <header className="space-y-4">
            <Badge>{categoryLabel}</Badge>
            <h1 className="text-4xl font-bold tracking-tight">
              {project.title}
            </h1>
            <p className="text-muted max-w-3xl text-lg leading-8">
              {project.description}
            </p>
          </header>
          <div className="border-border bg-surface-raised relative aspect-video overflow-hidden rounded-lg border">
            <Image
              alt={`${project.title} ${portfolioCopy.projectPreviewAlt}`}
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1280px) 80vw, 100vw"
              src={project.image}
            />
          </div>
          <Section
            id={`${project.slug}-technologies`}
            heading={portfolioCopy.projectTechnologiesHeading}
          >
            <ul className="flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <li key={technology}>
                  <Tag>{technology}</Tag>
                </li>
              ))}
            </ul>
          </Section>
          <Section
            id={`${project.slug}-links`}
            heading={portfolioCopy.projectLinksHeading}
          >
            <div className="flex flex-wrap gap-3">
              {project.demoUrl ? (
                <Button
                  href={project.demoUrl}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {portfolioCopy.liveDemoLabel}
                </Button>
              ) : null}
              <Button
                href={project.codeUrl}
                rel="noreferrer noopener"
                target="_blank"
                variant="outline"
              >
                {portfolioCopy.codeLabel}
              </Button>
            </div>
          </Section>
        </article>
      </div>
    </Container>
  );
}
