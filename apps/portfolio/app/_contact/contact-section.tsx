import { contactContent, portfolioCopy, socials } from "@repo/content";
import { Card, Section } from "@repo/ui";
import { ContactForm } from "./contact-form";

const linkClassName =
  "text-accent focus-visible:outline-focus inline-flex min-h-11 items-center rounded-sm font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2";

export function ContactSection() {
  return (
    <Section id="contact" heading={portfolioCopy.contactHeading}>
      <div className="grid gap-8 lg:grid-cols-[2fr_3fr]">
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-3xl font-bold tracking-tight">
              {contactContent.pitchHeading}
            </h3>
            <p className="text-muted max-w-prose text-lg leading-8">
              {contactContent.pitch}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="sr-only">{contactContent.detailsHeading}</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-muted text-sm font-medium">
                  {contactContent.emailLabel}
                </dt>
                <dd>
                  <a
                    className={linkClassName}
                    href={`mailto:${contactContent.email}`}
                  >
                    {contactContent.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-muted text-sm font-medium">
                  {contactContent.locationLabel}
                </dt>
                <dd className="font-medium">{contactContent.location}</dd>
              </div>
            </dl>

            <nav aria-labelledby="contact-socials-heading">
              <h4
                id="contact-socials-heading"
                className="text-muted text-sm font-medium"
              >
                {contactContent.socialProfilesLabel}
              </h4>
              <ul className="flex flex-wrap gap-x-5">
                {socials.map((social) => (
                  <li key={social.name}>
                    <a
                      className={linkClassName}
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

        <Card>
          <h3 className="mb-6 text-xl font-semibold">
            {contactContent.form.heading}
          </h3>
          <ContactForm />
        </Card>
      </div>
    </Section>
  );
}
