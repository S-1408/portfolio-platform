import type { Metadata } from "next";
import { resumeContent } from "@repo/content";
import { createPageMetadata } from "@repo/lib";
import { Button, Card, Container } from "@repo/ui";
import { siteConfig } from "../_seo/site";

export const metadata: Metadata = createPageMetadata(siteConfig, {
  title: resumeContent.title,
  description: resumeContent.metaDescription,
  path: "/resume",
});

export default function ResumePage() {
  const {
    title,
    summaryHeading,
    summary,
    pdfPath,
    downloadFileName,
    downloadLabel,
    openInNewTabLabel,
    viewerHeading,
    viewerTitle,
    fallbackMessage,
    fallbackLinkLabel,
  } = resumeContent;

  return (
    <Container className="py-section space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        <div className="flex flex-wrap gap-3">
          <Button href={pdfPath} download={downloadFileName}>
            {downloadLabel}
          </Button>
          <Button
            href={pdfPath}
            variant="outline"
            target="_blank"
            rel="noopener"
          >
            {openInNewTabLabel}
          </Button>
        </div>
      </header>

      <section aria-labelledby="resume-summary-heading" className="space-y-3">
        <h2 id="resume-summary-heading" className="text-2xl font-semibold">
          {summaryHeading}
        </h2>
        {summary.map((paragraph) => (
          <p key={paragraph} className="text-muted max-w-3xl text-lg leading-8">
            {paragraph}
          </p>
        ))}
      </section>

      <section aria-labelledby="resume-viewer-heading" className="space-y-4">
        <h2 id="resume-viewer-heading" className="sr-only">
          {viewerHeading}
        </h2>
        <Card className="overflow-hidden p-0">
          <object
            data={`${pdfPath}#view=FitH`}
            type="application/pdf"
            title={viewerTitle}
            aria-label={viewerTitle}
            className="block h-[80vh] min-h-[32rem] w-full"
          >
            {/* Rendered when the browser can't display PDFs inline (e.g. most mobile browsers). */}
            <div className="p-card space-y-4">
              <p className="text-muted">{fallbackMessage}</p>
              <Button href={pdfPath} download={downloadFileName}>
                {fallbackLinkLabel}
              </Button>
            </div>
          </object>
        </Card>
      </section>
    </Container>
  );
}
