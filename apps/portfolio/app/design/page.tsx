import { designSystemContent } from "@repo/content";
import {
  Badge,
  Button,
  Card,
  Container,
  Section,
  SkipLink,
  Tag,
  ThemeToggle,
  VisuallyHidden,
} from "@repo/ui";

export const metadata = {
  title: designSystemContent.title,
  robots: {
    index: false,
    follow: false,
  },
};

function ThemePreview({
  theme,
  label,
}: {
  theme: "light" | "dark";
  label: string;
}) {
  const componentSectionId = `design-components-${theme}`;

  return (
    <div
      data-theme={theme}
      className="border-border bg-background p-card text-ink shadow-card space-y-8 rounded-lg border"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">{label}</h2>
        <ThemeToggle labels={designSystemContent.themeToggle} />
      </div>

      <Section
        id={componentSectionId}
        heading={designSystemContent.sectionHeading}
        headingLevel={3}
        description={designSystemContent.sectionDescription}
      >
        <div className="grid gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold">
              {designSystemContent.buttonsHeading}
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">
                {designSystemContent.buttonLabels.primary}
              </Button>
              <Button variant="outline">
                {designSystemContent.buttonLabels.outline}
              </Button>
              <Button variant="ghost">
                {designSystemContent.buttonLabels.ghost}
              </Button>
              <Button href={`#${componentSectionId}`}>
                {designSystemContent.buttonLabels.link}
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">
                {designSystemContent.buttonLabels.small}
              </Button>
              <Button size="md">
                {designSystemContent.buttonLabels.medium}
              </Button>
              <Button size="lg">
                {designSystemContent.buttonLabels.large}
              </Button>
            </div>
          </div>

          <Card raised>
            <h4 className="font-semibold">{designSystemContent.cardHeading}</h4>
            <p className="text-muted mt-2">
              {designSystemContent.cardDescription}
            </p>
          </Card>

          <div className="space-y-4">
            <h4 className="font-semibold">
              {designSystemContent.badgeHeading}
            </h4>
            <div className="flex flex-wrap gap-3">
              <Badge>{designSystemContent.badgeLabels.neutral}</Badge>
              <Badge variant="primary">
                {designSystemContent.badgeLabels.primary}
              </Badge>
              <Badge variant="accent">
                {designSystemContent.badgeLabels.accent}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">{designSystemContent.tagHeading}</h4>
            <div className="flex flex-wrap gap-3">
              {designSystemContent.tagLabels.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <SkipLink href={`#${componentSectionId}`}>
              {designSystemContent.skipLinkLabel}
            </SkipLink>
            <button
              type="button"
              className="border-border bg-surface text-ink focus-visible:outline-focus rounded-md border px-4 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span aria-hidden="true">?</span>
              <VisuallyHidden>
                {designSystemContent.visuallyHiddenButtonLabel}
              </VisuallyHidden>
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default function DesignPage() {
  return (
    <main id="design-preview-main" className="py-section">
      <SkipLink href="#design-preview-main">
        {designSystemContent.skipLinkLabel}
      </SkipLink>
      <Container>
        <header className="mb-10 space-y-3">
          <h1 className="text-ink text-4xl font-bold tracking-tight">
            {designSystemContent.title}
          </h1>
          <p className="text-muted max-w-3xl text-lg">
            {designSystemContent.description}
          </p>
        </header>
        <div className="grid items-start gap-8 xl:grid-cols-2">
          <ThemePreview
            theme="light"
            label={designSystemContent.themes.light}
          />
          <ThemePreview theme="dark" label={designSystemContent.themes.dark} />
        </div>
      </Container>
    </main>
  );
}
