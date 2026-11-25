import { describe, expect, it } from "vitest";
import {
  createPageMetadata,
  createPersonJsonLd,
  createRobots,
  createRootMetadata,
  createSitemap,
  resolveSiteUrl,
  serializeJsonLd,
  type SiteConfig,
} from "./seo.js";

const site: SiteConfig = {
  url: new URL("https://example.com"),
  name: "Jane Doe",
  locale: "en_US",
  titleTemplate: "%s | Jane Doe",
  defaultTitle: "Jane Doe | Engineer",
  description: "Portfolio of Jane Doe.",
  keywords: ["Jane", "Engineer"],
  author: { name: "Jane Doe", url: "https://example.com" },
};

describe("resolveSiteUrl", () => {
  it("prefers NEXT_PUBLIC_SITE_URL and strips trailing slashes", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "https://jane.dev/",
        VERCEL_PROJECT_PRODUCTION_URL: "jane.vercel.app",
      }).toString(),
    ).toBe("https://jane.dev/");
  });

  it("falls back to the Vercel production domain with https", () => {
    expect(
      resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "jane.vercel.app" })
        .origin,
    ).toBe("https://jane.vercel.app");
  });

  it("falls back to localhost when nothing usable is set", () => {
    expect(resolveSiteUrl({}).origin).toBe("http://localhost:3000");
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "http://" }).origin).toBe(
      "http://localhost:3000",
    );
  });
});

describe("metadata helpers", () => {
  it("builds root metadata with a title template and no canonical", () => {
    const metadata = createRootMetadata(site);

    expect(metadata.metadataBase?.toString()).toBe("https://example.com/");
    expect(metadata.title).toEqual({
      default: "Jane Doe | Engineer",
      template: "%s | Jane Doe",
    });
    expect(metadata.alternates).toBeUndefined();
  });

  it("builds complete per-page Open Graph and canonical data", () => {
    const metadata = createPageMetadata(site, {
      title: "Projects",
      description: "All projects.",
      path: "/projects",
    });

    expect(metadata.title).toBe("Projects");
    expect(metadata.alternates).toEqual({ canonical: "/projects" });
    expect(metadata.openGraph).toMatchObject({
      siteName: "Jane Doe",
      url: "/projects",
      title: "Projects | Jane Doe",
    });
    expect(metadata.robots).toBeUndefined();
    expect(metadata.openGraph?.images).toBeUndefined();
  });

  it("applies the default social image unless the page overrides it", () => {
    const defaultImage = {
      url: "/og.png",
      width: 1200,
      height: 630,
      alt: "Default",
    };
    const withDefault = createPageMetadata(
      { ...site, defaultImage },
      { title: "Resume", description: "CV.", path: "/resume" },
    );
    const overridden = createPageMetadata(
      { ...site, defaultImage },
      {
        title: "Post",
        description: "A post.",
        path: "/post",
        image: { ...defaultImage, url: "/post.png" },
      },
    );

    expect(withDefault.openGraph?.images).toEqual([defaultImage]);
    expect(withDefault.twitter?.images).toEqual([defaultImage]);
    expect(overridden.openGraph?.images).toEqual([
      { ...defaultImage, url: "/post.png" },
    ]);
  });

  it("uses the default title for the home page", () => {
    const metadata = createPageMetadata(site, {
      description: "Home.",
      path: "/",
    });

    expect(metadata.title).toBeUndefined();
    expect(metadata.openGraph?.title).toBe("Jane Doe | Engineer");
  });
});

describe("JSON-LD", () => {
  it("creates a Person with optional fields only when present", () => {
    expect(
      createPersonJsonLd({
        name: "Jane Doe",
        jobTitle: "Engineer",
        url: "https://example.com",
        sameAs: ["https://github.com/jane"],
        address: { addressLocality: "Bengaluru", addressCountry: "IN" },
      }),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Jane Doe",
      jobTitle: "Engineer",
      url: "https://example.com",
      sameAs: ["https://github.com/jane"],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressCountry: "IN",
      },
    });
  });

  it("escapes < so the payload cannot close the script tag", () => {
    expect(serializeJsonLd({ name: "</script>" })).toBe(
      '{"name":"\\u003c/script>"}',
    );
  });
});

describe("sitemap and robots", () => {
  it("resolves sitemap paths to absolute URLs", () => {
    expect(
      createSitemap(site.url, [{ path: "/" }, { path: "/projects/a" }]),
    ).toEqual([
      { url: "https://example.com/" },
      { url: "https://example.com/projects/a" },
    ]);
  });

  it("points robots at the sitemap and can block everything", () => {
    expect(createRobots(site.url)).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: ["https://example.com/sitemap.xml"],
      host: "https://example.com",
    });
    expect(createRobots(site.url, { blockAll: true }).rules).toEqual({
      userAgent: "*",
      disallow: "/",
    });
  });
});
