import { profile, seoContent } from "@repo/content";
import { ogImageSize, renderOgCard } from "./_seo/og-card";

export const alt = seoContent.homeOgAlt;
export const size = ogImageSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderOgCard({
    eyebrow: profile.availabilityLine,
    title: profile.name,
    subtitle: profile.role,
    tags: seoContent.knowsAbout,
  });
}
