import type { Metadata, Viewport } from "next";
import {
  footerContent,
  headerLabels,
  navigationItems,
  portfolioCopy,
  profile,
  seoContent,
  socials,
} from "@repo/content";
import { createRootMetadata } from "@repo/lib";
import { Footer, Header, SkipLink } from "@repo/ui";
import { Lato } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { siteConfig } from "./_seo/site";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = createRootMetadata(siteConfig);

export const viewport: Viewport = {
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: seoContent.manifest.backgroundColor,
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: seoContent.manifest.darkThemeColor,
    },
  ],
};

const showBlog = process.env.NEXT_PUBLIC_ENABLE_BLOG === "true";
const visibleNavigationItems = navigationItems.filter(
  (item) => item.id !== "blog" || showBlog,
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lato.variable} font-sans`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SkipLink href="#main">{portfolioCopy.skipToContentLabel}</SkipLink>
          <Header
            navItems={visibleNavigationItems}
            logoSrc={portfolioCopy.logoPath}
            logoAlt={profile.name}
            labels={headerLabels}
          />
          <main id="main">{children}</main>
          <Footer content={footerContent} socials={socials} />
        </ThemeProvider>
      </body>
    </html>
  );
}
