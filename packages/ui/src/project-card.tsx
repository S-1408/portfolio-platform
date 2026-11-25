import Image from "next/image";
import Link from "next/link";
import { createElement } from "react";
import { Badge } from "./badge.js";
import { Button } from "./button.js";
import { Card } from "./card.js";
import { Tag } from "./tag.js";

export type ProjectCardProject = {
  slug: string;
  title: string;
  image: string;
  description: string;
  technologies: readonly string[];
  demoUrl?: string;
  codeUrl: string;
  featured?: boolean;
};

export type ProjectCardProps = {
  project: ProjectCardProject;
  categoryLabel: string;
  /** Heading level for the title; depends on the surrounding outline. */
  headingLevel?: 2 | 3;
  /** Load the image eagerly at high priority (above-the-fold / LCP cards). */
  prioritizeImage?: boolean;
  labels: {
    featured: string;
    liveDemo: string;
    code: string;
    previewAlt: string;
    technologies: string;
  };
};

// Rendered width is capped by the 80rem container: 3 columns ≈ 400px.
const imageSizes = "(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw";

/**
 * Server-renderable project card. The title is the single link to the detail
 * page (no duplicate image link), keeping one tab stop per destination.
 */
export function ProjectCard({
  project,
  categoryLabel,
  headingLevel = 3,
  prioritizeImage = false,
  labels,
}: ProjectCardProps) {
  const detailHref = `/projects/${project.slug}`;

  return (
    <Card className="flex h-full flex-col overflow-hidden p-0">
      <div className="bg-surface relative aspect-video w-full">
        <Image
          className="object-cover"
          src={project.image}
          alt={`${project.title} ${labels.previewAlt}`}
          fill
          sizes={imageSizes}
          {...(prioritizeImage
            ? { loading: "eager" as const, fetchPriority: "high" as const }
            : {})}
        />
      </div>
      <div className="p-card flex flex-1 flex-col">
        <div className="flex flex-wrap gap-2">
          <Badge>{categoryLabel}</Badge>
          {project.featured ? (
            <Badge variant="accent">{labels.featured}</Badge>
          ) : null}
        </div>
        {createElement(
          `h${headingLevel}`,
          { className: "mt-4 text-xl font-semibold" },
          <Link
            className="hover:text-accent focus-visible:outline-focus rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
            href={detailHref}
          >
            {project.title}
          </Link>,
        )}
        <p className="text-muted mt-2">{project.description}</p>
        <ul
          aria-label={`${project.title} ${labels.technologies}`}
          className="mt-4 flex flex-wrap gap-2"
        >
          {project.technologies.map((technology) => (
            <li key={technology}>
              <Tag>{technology}</Tag>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-3 pt-6">
          {project.demoUrl ? (
            <Button
              href={project.demoUrl}
              size="sm"
              variant="outline"
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${labels.liveDemo}: ${project.title}`}
            >
              {labels.liveDemo}
            </Button>
          ) : null}
          <Button
            href={project.codeUrl}
            size="sm"
            variant="ghost"
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${labels.code}: ${project.title}`}
          >
            {labels.code}
          </Button>
        </div>
      </div>
    </Card>
  );
}
