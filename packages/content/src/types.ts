export type ProjectCategory = "react" | "angular" | "nextjs" | "javascript";

export type Profile = {
  name: string;
  role: string;
  availabilityLine: string;
  intro: string;
  location: string;
  email: string;
  yearsOfExperience: number;
  resumePath: string;
  photo: string;
};

export type SocialLink = {
  name: "LinkedIn" | "Instagram" | "GitHub";
  url: string;
  icon: "linkedin" | "instagram" | "github";
};

export type SkillGroup = {
  number: number;
  title: string;
  skills: string[];
};

export type Experience = {
  company: string;
  role: string;
  start: string;
  end: string;
  client: string;
  summary: string;
  bullets: string[];
  techStack: string[];
};

export type HighlightKind =
  "education" | "certification" | "creator" | "interests";

export type Highlight = {
  kind: HighlightKind;
  title: string;
  description?: string;
  url?: string;
};

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  image: string;
  description: string;
  technologies: string[];
  demoUrl?: string;
  codeUrl: string;
  featured?: boolean;
  year?: number;
};

export type ProjectFilter = {
  label: string;
  value: "all" | ProjectCategory;
};

export type NavigationItem = {
  id: string;
  label: string;
  href: string;
  sectionId?: string;
  crossZone?: boolean;
  download?: boolean;
};

export type HeaderLabels = {
  navigationLabel: string;
  mobileMenuLabel: string;
  openMenuLabel: string;
  closeMenuLabel: string;
  themeToggleLabels: {
    light: string;
    dark: string;
  };
};

export type FooterContent = {
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

export type ContactContent = {
  pitchHeading: string;
  pitch: string;
  detailsHeading: string;
  emailLabel: string;
  email: string;
  locationLabel: string;
  location: string;
  socialProfilesLabel: string;
  form: {
    heading: string;
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
    requiredLabel: string;
    honeypotLabel: string;
    submitLabel: string;
    submittingLabel: string;
    successMessage: string;
    invalidMessage: string;
    rateLimitedMessage: string;
    unavailableMessage: string;
    sendFailedMessage: string;
  };
  validation: {
    nameRequired: string;
    nameTooLong: string;
    emailInvalid: string;
    emailTooLong: string;
    messageTooShort: string;
    messageTooLong: string;
  };
  emailSubjectPrefix: string;
};

export type ResumeContent = {
  title: string;
  metaDescription: string;
  summaryHeading: string;
  summary: string[];
  pdfPath: string;
  downloadFileName: string;
  downloadLabel: string;
  openInNewTabLabel: string;
  viewerHeading: string;
  viewerTitle: string;
  fallbackMessage: string;
  fallbackLinkLabel: string;
};

export type SeoContent = {
  siteName: string;
  titleTemplate: string;
  defaultTitle: string;
  description: string;
  keywords: string[];
  locale: string;
  addressLocality: string;
  addressCountry: string;
  knowsAbout: string[];
  homeOgAlt: string;
  projectOgAltSuffix: string;
  manifest: {
    name: string;
    shortName: string;
    backgroundColor: string;
    themeColor: string;
    darkThemeColor: string;
  };
};

export type NotFoundContent = {
  title: string;
  code: string;
  heading: string;
  description: string;
  homeLabel: string;
  projectsLabel: string;
};

export type ErrorPageContent = {
  title: string;
  heading: string;
  description: string;
  retryLabel: string;
  homeLabel: string;
  referenceLabel: string;
};
