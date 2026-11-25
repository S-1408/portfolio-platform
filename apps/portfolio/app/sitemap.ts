import type { MetadataRoute } from "next";
import { projects } from "@repo/content";
import { createSitemap } from "@repo/lib";
import { siteConfig } from "./_seo/site";

// /design is an internal, noindex design-system page, so it's left out.
export default function sitemap(): MetadataRoute.Sitemap {
  return createSitemap(siteConfig.url, [
    { path: "/", changeFrequency: "monthly", priority: 1 },
    { path: "/projects", changeFrequency: "monthly", priority: 0.8 },
    { path: "/resume", changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((project) => ({
      path: `/projects/${project.slug}`,
      changeFrequency: "yearly" as const,
      priority: project.featured ? 0.7 : 0.5,
    })),
  ]);
}
