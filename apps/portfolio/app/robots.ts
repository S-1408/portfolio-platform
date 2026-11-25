import type { MetadataRoute } from "next";
import { createRobots } from "@repo/lib";
import { isIndexable, siteConfig } from "./_seo/site";

export default function robots(): MetadataRoute.Robots {
  return createRobots(siteConfig.url, { blockAll: !isIndexable });
}
