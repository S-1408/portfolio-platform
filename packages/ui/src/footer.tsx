import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

export type FooterSocialLink = {
  name: string;
  url: string;
  icon: "linkedin" | "instagram" | "github";
};

export type FooterProps = {
  content: {
    hireHeading: string;
    hireBlurb: string;
    socialProfilesLabel: string;
    locationLabel: string;
    location: string;
    emailLabel: string;
    email: string;
    copyrightName: string;
    copyrightSuffix: string;
    builtWith: string;
  };
  socials: readonly FooterSocialLink[];
};

const socialIcons = {
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  github: FaGithub,
};

export function Footer({ content, socials }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border bg-surface text-ink border-t">
      <div className="px-page-x mx-auto grid max-w-7xl gap-10 py-12 md:grid-cols-3">
        <section>
          <h2 className="text-lg font-semibold">{content.hireHeading}</h2>
          <p className="text-muted mt-3 max-w-sm">{content.hireBlurb}</p>
        </section>

        <nav aria-label={content.socialProfilesLabel}>
          <h2 className="text-lg font-semibold">
            {content.socialProfilesLabel}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-4">
            {socials.map((social) => {
              const Icon = socialIcons[social.icon];

              return (
                <li key={social.name}>
                  <a
                    className="text-accent focus-visible:outline-focus inline-flex min-h-11 items-center gap-2 rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
                    href={social.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.name}
                  >
                    <Icon aria-hidden="true" size={20} />
                    <span>{social.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <address className="not-italic">
          <h2 className="text-lg font-semibold">{content.emailLabel}</h2>
          <p className="text-muted mt-3">
            <span className="text-ink font-medium">
              {content.locationLabel}:{" "}
            </span>
            {content.location}
          </p>
          <a
            className="text-accent focus-visible:outline-focus mt-2 inline-flex min-h-11 items-center rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
            href={`mailto:${content.email}`}
          >
            {content.email}
          </a>
        </address>
      </div>

      <div className="border-border px-page-x text-muted border-t py-5 text-center text-sm">
        <p>
          © {currentYear} {content.copyrightName}. {content.copyrightSuffix}
        </p>
        <p className="mt-1">{content.builtWith}</p>
      </div>
    </footer>
  );
}
