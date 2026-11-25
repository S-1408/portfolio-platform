export type {
  ContactContent,
  ErrorPageContent,
  Experience,
  Highlight,
  HighlightKind,
  FooterContent,
  HeaderLabels,
  NavigationItem,
  NotFoundContent,
  Profile,
  Project,
  ProjectCategory,
  ProjectFilter,
  ResumeContent,
  SeoContent,
  SkillGroup,
  SocialLink,
} from "./types.js";

export { profile } from "./profile.js";
export { socials } from "./socials.js";
export { navigationItems, headerLabels } from "./navigation.js";
export { footerContent } from "./footer.js";
export { skillGroups } from "./skills.js";
export { experience } from "./experience.js";
export { highlights } from "./highlights.js";
export { projects } from "./projects.js";
export { projectFilters } from "./filters.js";
export { designSystemContent } from "./design-system.js";
export { portfolioCopy } from "./copy.js";
export { contactContent } from "./contact.js";
export { resumeContent } from "./resume.js";
export { errorPageContent, notFoundContent, seoContent } from "./seo.js";
export { parsePortfolioContent, portfolioContentSchema } from "./validate.js";
