import { profile, seoContent } from "@repo/content";
import { resolveSiteUrl, type SiteConfig } from "@repo/lib";

const siteUrl = resolveSiteUrl({
  // Referenced individually so Next.js can inline the public value.
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
});

export const siteConfig: SiteConfig = {
  url: siteUrl,
  name: seoContent.siteName,
  locale: seoContent.locale,
  titleTemplate: seoContent.titleTemplate,
  defaultTitle: seoContent.defaultTitle,
  description: seoContent.description,
  keywords: seoContent.keywords,
  author: { name: profile.name, url: siteUrl.toString() },
  defaultImage: {
    // Served by app/opengraph-image.tsx (1200×630).
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: seoContent.homeOgAlt,
  },
};

/** Preview deployments should never be indexed. */
export const isIndexable = process.env.VERCEL_ENV !== "preview";
