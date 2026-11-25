import type { Metadata } from "next";
import {
  footerContent,
  headerLabels,
  navigationItems,
  portfolioCopy,
  profile,
  socials,
} from "@repo/content";
import { Footer, Header, SkipLink } from "@repo/ui";
import { Lato } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} | ${profile.role}`,
  description: profile.intro,
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
