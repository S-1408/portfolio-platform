import { z } from "zod";
import { contactContent } from "./contact.js";
import { portfolioCopy } from "./copy.js";
import { designSystemContent } from "./design-system.js";
import { experience } from "./experience.js";
import { footerContent } from "./footer.js";
import { headerLabels, navigationItems } from "./navigation.js";
import { highlights } from "./highlights.js";
import { profile } from "./profile.js";
import { projects } from "./projects.js";
import { projectFilters } from "./filters.js";
import { resumeContent } from "./resume.js";
import { errorPageContent, notFoundContent, seoContent } from "./seo.js";
import { skillGroups } from "./skills.js";
import { socials } from "./socials.js";

const projectCategories = ["react", "angular", "nextjs", "javascript"] as const;

const projectCategorySchema = z.enum(projectCategories);

const profileSchema = z
  .object({
    name: z.string().min(1),
    role: z.string().min(1),
    availabilityLine: z.string().min(1),
    intro: z.string().min(1),
    location: z.string().min(1),
    email: z.string().email(),
    yearsOfExperience: z.number().int().positive(),
    resumePath: z.string().startsWith("/"),
    photo: z.string().startsWith("/"),
  })
  .strict();

const socialLinkSchema = z
  .object({
    name: z.enum(["LinkedIn", "Instagram", "GitHub"]),
    url: z.string().url(),
    icon: z.enum(["linkedin", "instagram", "github"]),
  })
  .strict();

const skillGroupSchema = z
  .object({
    number: z.number().int().positive(),
    title: z.string().min(1),
    skills: z.array(z.string().min(1)).min(1),
  })
  .strict();

const experienceSchema = z
  .object({
    company: z.string().min(1),
    role: z.string().min(1),
    start: z.string().min(1),
    end: z.string().min(1),
    client: z.string().min(1),
    summary: z.string().min(1),
    bullets: z.array(z.string().min(1)).min(1),
    techStack: z.array(z.string().min(1)).min(1),
  })
  .strict();

const highlightSchema = z
  .object({
    kind: z.enum(["education", "certification", "creator", "interests"]),
    title: z.string().min(1),
    description: z.string().min(1).optional(),
    url: z.string().url().optional(),
  })
  .strict();

const projectSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    category: projectCategorySchema,
    image: z.string().startsWith("/projects/"),
    description: z.string().min(1),
    technologies: z.array(z.string().min(1)).min(1),
    demoUrl: z.string().url().optional(),
    codeUrl: z.string().url(),
    featured: z.boolean().optional(),
    year: z.number().int().min(1990).max(2100).optional(),
  })
  .strict();

const projectFilterSchema = z
  .object({
    label: z.string().min(1),
    value: z.enum(["all", ...projectCategories]),
  })
  .strict();

const navigationItemSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    href: z.string().startsWith("/"),
    sectionId: z.string().min(1).optional(),
    crossZone: z.boolean().optional(),
    download: z.boolean().optional(),
  })
  .strict();

const headerLabelsSchema = z
  .object({
    navigationLabel: z.string().min(1),
    mobileMenuLabel: z.string().min(1),
    openMenuLabel: z.string().min(1),
    closeMenuLabel: z.string().min(1),
    themeToggleLabels: z
      .object({
        light: z.string().min(1),
        dark: z.string().min(1),
      })
      .strict(),
  })
  .strict();

const footerContentSchema = z
  .object({
    hireHeading: z.string().min(1),
    hireBlurb: z.string().min(1),
    socialProfilesLabel: z.string().min(1),
    locationLabel: z.string().min(1),
    location: z.string().min(1),
    emailLabel: z.string().min(1),
    email: z.string().email(),
    copyrightName: z.string().min(1),
    copyrightSuffix: z.string().min(1),
    builtWith: z.string().min(1),
  })
  .strict();

const portfolioCopySchema = z
  .object({
    logoPath: z.string().startsWith("/"),
    resumeLabel: z.string().min(1),
    yearsOfExperienceLabel: z.string().min(1),
    skillsHeading: z.string().min(1),
    experienceHeading: z.string().min(1),
    highlightsHeading: z.string().min(1),
    projectsHeading: z.string().min(1),
    featuredProjectsHeading: z.string().min(1),
    viewAllProjectsLabel: z.string().min(1),
    projectsPageTitle: z.string().min(1),
    projectsPageDescription: z.string().min(1),
    projectSearchLabel: z.string().min(1),
    projectSearchPlaceholder: z.string().min(1),
    searchProjectsLabel: z.string().min(1),
    projectResultsSingular: z.string().min(1),
    projectResultsPlural: z.string().min(1),
    noProjectsFoundHeading: z.string().min(1),
    noProjectsFoundDescription: z.string().min(1),
    projectsLoadingLabel: z.string().min(1),
    backToProjectsLabel: z.string().min(1),
    projectTechnologiesHeading: z.string().min(1),
    projectLinksHeading: z.string().min(1),
    liveDemoLabel: z.string().min(1),
    codeLabel: z.string().min(1),
    socialProfilesLabel: z.string().min(1),
    skipToContentLabel: z.string().min(1),
    projectFiltersLabel: z.string().min(1),
    projectPreviewAlt: z.string().min(1),
    featuredLabel: z.string().min(1),
    contactHeading: z.string().min(1),
  })
  .strict();

const designSystemContentSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    themes: z
      .object({
        light: z.string().min(1),
        dark: z.string().min(1),
      })
      .strict(),
    sectionHeading: z.string().min(1),
    sectionDescription: z.string().min(1),
    buttonsHeading: z.string().min(1),
    buttonLabels: z
      .object({
        primary: z.string().min(1),
        outline: z.string().min(1),
        ghost: z.string().min(1),
        link: z.string().min(1),
        small: z.string().min(1),
        medium: z.string().min(1),
        large: z.string().min(1),
      })
      .strict(),
    cardHeading: z.string().min(1),
    cardDescription: z.string().min(1),
    badgeHeading: z.string().min(1),
    badgeLabels: z
      .object({
        neutral: z.string().min(1),
        primary: z.string().min(1),
        accent: z.string().min(1),
      })
      .strict(),
    tagHeading: z.string().min(1),
    tagLabels: z.array(z.string().min(1)),
    themeToggle: z
      .object({
        light: z.string().min(1),
        dark: z.string().min(1),
      })
      .strict(),
    skipLinkLabel: z.string().min(1),
    visuallyHiddenButtonLabel: z.string().min(1),
  })
  .strict();

const nonEmpty = z.string().min(1);

const contactContentSchema = z
  .object({
    pitchHeading: nonEmpty,
    pitch: nonEmpty,
    detailsHeading: nonEmpty,
    emailLabel: nonEmpty,
    email: z.string().email(),
    locationLabel: nonEmpty,
    location: nonEmpty,
    socialProfilesLabel: nonEmpty,
    form: z
      .object({
        heading: nonEmpty,
        nameLabel: nonEmpty,
        emailLabel: nonEmpty,
        messageLabel: nonEmpty,
        requiredLabel: nonEmpty,
        honeypotLabel: nonEmpty,
        submitLabel: nonEmpty,
        submittingLabel: nonEmpty,
        successMessage: nonEmpty,
        invalidMessage: nonEmpty,
        rateLimitedMessage: nonEmpty,
        unavailableMessage: nonEmpty,
        sendFailedMessage: nonEmpty,
      })
      .strict(),
    validation: z
      .object({
        nameRequired: nonEmpty,
        nameTooLong: nonEmpty,
        emailInvalid: nonEmpty,
        emailTooLong: nonEmpty,
        messageTooShort: nonEmpty,
        messageTooLong: nonEmpty,
      })
      .strict(),
    emailSubjectPrefix: nonEmpty,
  })
  .strict();

const resumeContentSchema = z
  .object({
    title: nonEmpty,
    metaDescription: nonEmpty,
    summaryHeading: nonEmpty,
    summary: z.array(nonEmpty).min(1),
    pdfPath: z.string().startsWith("/").endsWith(".pdf"),
    downloadFileName: z.string().endsWith(".pdf"),
    downloadLabel: nonEmpty,
    openInNewTabLabel: nonEmpty,
    viewerHeading: nonEmpty,
    viewerTitle: nonEmpty,
    fallbackMessage: nonEmpty,
    fallbackLinkLabel: nonEmpty,
  })
  .strict();

const hexColor = z.string().regex(/^#[0-9a-f]{6}$/i);

const seoContentSchema = z
  .object({
    siteName: nonEmpty,
    titleTemplate: z.string().includes("%s"),
    defaultTitle: nonEmpty,
    description: z.string().min(50).max(160),
    keywords: z.array(nonEmpty).min(1),
    locale: z.string().regex(/^[a-z]{2}_[A-Z]{2}$/),
    addressLocality: nonEmpty,
    addressCountry: z.string().length(2),
    knowsAbout: z.array(nonEmpty).min(1),
    homeOgAlt: nonEmpty,
    projectOgAltSuffix: nonEmpty,
    manifest: z
      .object({
        name: nonEmpty,
        shortName: z.string().min(1).max(12),
        backgroundColor: hexColor,
        themeColor: hexColor,
        darkThemeColor: hexColor,
      })
      .strict(),
  })
  .strict();

const notFoundContentSchema = z
  .object({
    title: nonEmpty,
    code: nonEmpty,
    heading: nonEmpty,
    description: nonEmpty,
    homeLabel: nonEmpty,
    projectsLabel: nonEmpty,
  })
  .strict();

const errorPageContentSchema = z
  .object({
    title: nonEmpty,
    heading: nonEmpty,
    description: nonEmpty,
    retryLabel: nonEmpty,
    homeLabel: nonEmpty,
    referenceLabel: nonEmpty,
  })
  .strict();

export const portfolioContentSchema = z
  .object({
    profile: profileSchema,
    socials: z.array(socialLinkSchema).length(3),
    skillGroups: z.array(skillGroupSchema).length(5),
    experience: z.array(experienceSchema).length(2),
    highlights: z.array(highlightSchema).length(4),
    projects: z.array(projectSchema).length(15),
    projectFilters: z.array(projectFilterSchema).length(5),
    navigationItems: z.array(navigationItemSchema).length(6),
    headerLabels: headerLabelsSchema,
    footerContent: footerContentSchema,
    portfolioCopy: portfolioCopySchema,
    designSystemContent: designSystemContentSchema,
    contactContent: contactContentSchema,
    resumeContent: resumeContentSchema,
    seoContent: seoContentSchema,
    notFoundContent: notFoundContentSchema,
    errorPageContent: errorPageContentSchema,
  })
  .strict();

export function parsePortfolioContent() {
  return portfolioContentSchema.parse({
    profile,
    socials,
    skillGroups,
    experience,
    highlights,
    projects,
    projectFilters,
    navigationItems,
    headerLabels,
    footerContent,
    portfolioCopy,
    designSystemContent,
    contactContent,
    resumeContent,
    seoContent,
    notFoundContent,
    errorPageContent,
  });
}

parsePortfolioContent();
