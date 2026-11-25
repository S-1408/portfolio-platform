import Image from "next/image";
import {
  experience,
  highlights,
  portfolioCopy,
  profile,
  projectFilters,
  projects,
  skillGroups,
  socials,
} from "@repo/content";
import type { ProjectCategory } from "@repo/content";
import { Badge, Button, Card, Container, Section, Tag } from "@repo/ui";

function getProjectFilterLabel(category: ProjectCategory) {
  const filter = projectFilters.find((item) => item.value === category);

  if (!filter) {
    throw new Error(`Missing filter for project category "${category}"`);
  }

  return filter.label;
}

export default function HomePage() {
  return (
    <div className="home-page-background bg-background text-ink py-section min-h-screen">
      <div aria-hidden="true" className="home-page-motion">
        <span className="home-page-motion__shape home-page-motion__shape--teal" />
        <span className="home-page-motion__shape home-page-motion__shape--orange" />
        <span className="home-page-motion__shape home-page-motion__shape--teal-small" />
        <span className="home-page-motion__particle home-page-motion__particle--one" />
        <span className="home-page-motion__particle home-page-motion__particle--two" />
        <span className="home-page-motion__particle home-page-motion__particle--three" />
        <span className="home-page-motion__particle home-page-motion__particle--four" />
        <span className="home-page-motion__particle home-page-motion__particle--five" />
        <span className="home-page-motion__particle home-page-motion__particle--six" />
      </div>
      <Container className="space-y-section relative z-10">
        <header
          id="home"
          className="grid items-center gap-10 md:grid-cols-[1fr_auto]"
        >
          <div className="space-y-5">
            <p className="availability-pill">
              <span aria-hidden="true" className="availability-pill__dot" />
              {profile.availabilityLine}
            </p>
            <div className="space-y-2">
              <h1 className="text-5xl font-bold tracking-tight">
                {profile.name}
              </h1>
              <p className="home-designation text-muted text-2xl">
                {profile.role}
              </p>
            </div>
            <p className="home-intro-accent text-muted max-w-2xl text-lg leading-8">
              {profile.intro}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <span>{profile.location}</span>
              <a
                className="text-accent font-medium underline underline-offset-4"
                href={`mailto:${profile.email}`}
              >
                {profile.email}
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button href={profile.resumePath} download>
                {portfolioCopy.resumeLabel}
              </Button>
              <nav aria-label={portfolioCopy.socialProfilesLabel}>
                <ul className="flex flex-wrap gap-3">
                  {socials.map((social) => (
                    <li key={social.name}>
                      <a
                        className="text-accent font-medium underline underline-offset-4"
                        href={social.url}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {social.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Image
              className="border-primary shadow-card size-56 rounded-full border-4 object-cover"
              src={profile.photo}
              alt={`${profile.name}, ${profile.role}`}
              width={224}
              height={224}
              priority
            />
            <Card className="flex items-center gap-3">
              <span className="text-accent text-3xl font-bold">
                {profile.yearsOfExperience}+
              </span>
              <span className="text-muted max-w-28 text-sm">
                {portfolioCopy.yearsOfExperienceLabel}
              </span>
            </Card>
          </div>
        </header>

        <Section id="about" heading={portfolioCopy.skillsHeading}>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {skillGroups.map((group) => (
              <Card key={group.title}>
                <p className="text-accent text-sm font-bold">
                  {String(group.number).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-lg font-semibold">{group.title}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li key={skill}>
                      <Tag>{skill}</Tag>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="experience" heading={portfolioCopy.experienceHeading}>
          <div className="grid gap-5">
            {experience.map((position) => (
              <Card key={`${position.company}-${position.start}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {position.company}
                    </h3>
                    <p className="text-muted mt-1">{position.role}</p>
                  </div>
                  <p className="text-muted font-medium">
                    {position.start} – {position.end}
                  </p>
                </div>
                <p className="mt-4 font-medium">{position.client}</p>
                <p className="text-muted mt-2">{position.summary}</p>
                <ul className="text-muted mt-4 list-inside list-disc space-y-2">
                  {position.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {position.techStack.map((technology) => (
                    <li key={technology}>
                      <Tag>{technology}</Tag>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="highlights" heading={portfolioCopy.highlightsHeading}>
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {highlights.map((highlight) => (
              <li key={highlight.kind}>
                <Card className="h-full">
                  <h3 className="font-semibold">
                    {highlight.url ? (
                      <a
                        className="text-accent underline underline-offset-4"
                        href={highlight.url}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {highlight.title}
                      </a>
                    ) : (
                      highlight.title
                    )}
                  </h3>
                  {highlight.description ? (
                    <p className="text-muted mt-2">{highlight.description}</p>
                  ) : null}
                </Card>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="projects" heading={portfolioCopy.projectsHeading}>
          <ul
            aria-label={portfolioCopy.projectFiltersLabel}
            className="mb-6 flex flex-wrap gap-2"
          >
            {projectFilters.map((filter) => (
              <li key={filter.value}>
                <Tag>{filter.label}</Tag>
              </li>
            ))}
          </ul>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <Card
                key={project.slug}
                className="flex h-full flex-col overflow-hidden p-0"
              >
                <div className="relative aspect-video w-full">
                  <Image
                    className="object-cover"
                    src={project.image}
                    alt={`${project.title} ${portfolioCopy.projectPreviewAlt}`}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <div className="p-card flex flex-1 flex-col">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{getProjectFilterLabel(project.category)}</Badge>
                    {project.featured ? (
                      <Badge variant="accent">
                        {portfolioCopy.featuredLabel}
                      </Badge>
                    ) : null}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">
                    {project.title}
                  </h3>
                  <p className="text-muted mt-2">{project.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.map((technology) => (
                      <li key={technology}>
                        <Tag>{technology}</Tag>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap gap-3 pt-6">
                    {project.demoUrl ? (
                      <Button
                        href={project.demoUrl}
                        size="sm"
                        variant="outline"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {portfolioCopy.liveDemoLabel}
                      </Button>
                    ) : null}
                    <Button
                      href={project.codeUrl}
                      size="sm"
                      variant="ghost"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {portfolioCopy.codeLabel}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="contact" heading={portfolioCopy.contactHeading}>
          <Button href={`mailto:${profile.email}`}>{profile.email}</Button>
        </Section>
      </Container>
    </div>
  );
}
