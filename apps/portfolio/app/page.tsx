import { projects, siteContent } from "@repo/content";
import { formatYearRange } from "@repo/lib";
import { Button } from "@repo/ui";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-12 px-6 py-20">
      <section aria-labelledby="intro-title" className="flex flex-col gap-5">
        <p className="text-sm font-semibold tracking-wide text-slate-600">
          {siteContent.eyebrow}
        </p>
        <h1 id="intro-title" className="text-4xl font-bold tracking-tight">
          {siteContent.title}
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-700">
          {siteContent.description}
        </p>
        <Button type="button">{siteContent.callToAction}</Button>
      </section>

      <section aria-labelledby="projects-title" className="flex flex-col gap-5">
        <h2 id="projects-title" className="text-2xl font-semibold">
          {siteContent.projectsHeading}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <li
              key={project.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <h3 className="font-semibold">{project.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {project.description}
              </p>
              <p className="mt-4 text-sm text-slate-500">
                {formatYearRange(project.startYear, project.endYear)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
