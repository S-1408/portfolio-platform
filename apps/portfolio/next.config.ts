import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

// @next/bundle-analyzer only hooks into webpack builds; see the "analyze"
// script. For Turbopack's own analyzer use "analyze:turbopack".
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

/**
 * Multi-Zones: this app owns the domain and proxies the blog zone's paths to
 * its own deployment. The blog app must use `basePath: "/blog"` and
 * `assetPrefix: "/blog-static"`. Without BLOG_URL, /blog simply 404s.
 */
function getBlogUrl() {
  const value = process.env.BLOG_URL?.trim();
  if (!value) return null;

  const url = new URL(value); // throws at build time on a malformed value
  return url.origin;
}

const blogUrl = getBlogUrl();

const nextConfig: NextConfig = {
  // Analysis builds use their own folder so they never clobber `next dev`/`next build`.
  ...(process.env.ANALYZE === "true" ? { distDir: ".next-analyze" } : {}),
  transpilePackages: ["@repo/config", "@repo/content", "@repo/lib", "@repo/ui"],
  async rewrites() {
    if (!blogUrl) return [];

    return [
      { source: "/blog", destination: `${blogUrl}/blog` },
      { source: "/blog/:path+", destination: `${blogUrl}/blog/:path+` },
      {
        source: "/blog-static/:path+",
        destination: `${blogUrl}/blog-static/:path+`,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
