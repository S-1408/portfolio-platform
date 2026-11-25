import type { MetadataRoute } from "next";
import { seoContent } from "@repo/content";

export default function manifest(): MetadataRoute.Manifest {
  const config = seoContent.manifest;

  return {
    name: config.name,
    short_name: config.shortName,
    description: seoContent.description,
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: config.backgroundColor,
    theme_color: config.themeColor,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
