import type { Metadata, MetadataRoute } from "next";

/**
 * Framework-level SEO helpers shared by every zone (portfolio, blog, …).
 * They only shape data; all copy comes from the caller (usually @repo/content).
 */

export type SiteConfig = {
  /** Absolute origin, e.g. https://example.com (no trailing slash needed). */
  url: URL;
  name: string;
  locale: string;
  titleTemplate: string;
  defaultTitle: string;
  description: string;
  keywords?: readonly string[];
  author: { name: string; url?: string };
  /**
   * Fallback social image. Pages that set their own metadata lose the root
   * segment's file-based image (shallow merge), so it is re-applied here.
   * Metadata images win over a segment's opengraph-image file, so pages with
   * their own generated image must pass it via `image`.
   */
  defaultImage?: SocialImage;
};

export type SocialImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

export type SiteUrlEnv = {
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
};

const LOCAL_SITE_URL = "http://localhost:3000";

function toUrl(value: string) {
  const trimmed = value.trim();
  const url = new URL(
    /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`,
  );
  // Keep only the origin; canonical paths are appended per page.
  return new URL(url.origin);
}

/**
 * Resolves the canonical site origin. Prefers an explicit NEXT_PUBLIC_SITE_URL,
 * then Vercel's production domain, then localhost for development.
 */
export function resolveSiteUrl(env: SiteUrlEnv): URL {
  const candidate =
    env.NEXT_PUBLIC_SITE_URL?.trim() ||
    env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

  if (!candidate) {
    return new URL(LOCAL_SITE_URL);
  }

  try {
    return toUrl(candidate);
  } catch {
    return new URL(LOCAL_SITE_URL);
  }
}

export function absoluteUrl(path: string, siteUrl: URL): string {
  return new URL(path, siteUrl).toString();
}

/** Root-layout metadata: metadataBase, title template, defaults for all pages. */
export function createRootMetadata(site: SiteConfig): Metadata {
  return {
    metadataBase: site.url,
    title: { default: site.defaultTitle, template: site.titleTemplate },
    description: site.description,
    keywords: site.keywords ? [...site.keywords] : undefined,
    authors: [site.author],
    creator: site.author.name,
    applicationName: site.name,
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.locale,
      title: site.defaultTitle,
      description: site.description,
    },
    twitter: {
      card: "summary_large_image",
      title: site.defaultTitle,
      description: site.description,
    },
  };
}

export type PageMetadataOptions = {
  /** Page title; the root template adds the site suffix. Omit for the home page. */
  title?: string;
  description: string;
  /** Path relative to the site origin, used for canonical and og:url. */
  path: string;
  openGraphType?: "website" | "article" | "profile";
  /** Overrides SiteConfig.defaultImage for this page. */
  image?: SocialImage;
  noIndex?: boolean;
};

/**
 * Per-page metadata. Next.js merges metadata shallowly, so `openGraph` and
 * `twitter` are rebuilt in full here rather than relying on the root values.
 */
export function createPageMetadata(
  site: SiteConfig,
  {
    title,
    description,
    path,
    openGraphType = "website",
    image = site.defaultImage,
    noIndex = false,
  }: PageMetadataOptions,
): Metadata {
  const images = image ? [image] : undefined;
  const socialTitle = title
    ? site.titleTemplate.replace("%s", title)
    : site.defaultTitle;

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: openGraphType,
      siteName: site.name,
      locale: site.locale,
      url: path,
      title: socialTitle,
      description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      ...(images ? { images } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

export type PersonJsonLdOptions = {
  name: string;
  jobTitle: string;
  url: string;
  description?: string;
  image?: string;
  email?: string;
  sameAs?: readonly string[];
  address?: { addressLocality: string; addressCountry?: string };
  knowsAbout?: readonly string[];
};

export function createPersonJsonLd({
  name,
  jobTitle,
  url,
  description,
  image,
  email,
  sameAs,
  address,
  knowsAbout,
}: PersonJsonLdOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    url,
    ...(description ? { description } : {}),
    ...(image ? { image } : {}),
    ...(email ? { email: `mailto:${email}` } : {}),
    ...(sameAs?.length ? { sameAs: [...sameAs] } : {}),
    ...(address ? { address: { "@type": "PostalAddress", ...address } } : {}),
    ...(knowsAbout?.length ? { knowsAbout: [...knowsAbout] } : {}),
  };
}

/** Serializes JSON-LD for a <script> tag, escaping `<` so it can't close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export type SitemapRoute = {
  path: string;
  lastModified?: string | Date;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
};

export function createSitemap(
  siteUrl: URL,
  routes: readonly SitemapRoute[],
): MetadataRoute.Sitemap {
  return routes.map(({ path, ...rest }) => ({
    url: absoluteUrl(path, siteUrl),
    ...rest,
  }));
}

export type RobotsOptions = {
  disallow?: readonly string[];
  /** Block all crawling, e.g. on preview deployments. */
  blockAll?: boolean;
  /** Extra sitemaps, e.g. from other zones. Paths resolve against siteUrl. */
  additionalSitemaps?: readonly string[];
};

export function createRobots(
  siteUrl: URL,
  {
    disallow = [],
    blockAll = false,
    additionalSitemaps = [],
  }: RobotsOptions = {},
): MetadataRoute.Robots {
  return {
    rules: blockAll
      ? { userAgent: "*", disallow: "/" }
      : {
          userAgent: "*",
          allow: "/",
          ...(disallow.length ? { disallow: [...disallow] } : {}),
        },
    sitemap: ["/sitemap.xml", ...additionalSitemaps].map((path) =>
      absoluteUrl(path, siteUrl),
    ),
    host: siteUrl.origin,
  };
}
