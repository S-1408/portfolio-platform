import { notFound } from "next/navigation";
import { projectFilters, projects, seoContent } from "@repo/content";
import { ogImageSize, renderOgCard } from "../../_seo/og-card";

export const alt = `Preview of a ${seoContent.projectOgAltSuffix}`;
export const size = ogImageSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export default async function ProjectOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const category =
    projectFilters.find((filter) => filter.value === project.category)?.label ??
    project.category;

  return renderOgCard({
    eyebrow: category,
    title: project.title,
    subtitle: project.description,
    tags: project.technologies,
    screenshot: project.image,
  });
}
