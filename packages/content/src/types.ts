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
