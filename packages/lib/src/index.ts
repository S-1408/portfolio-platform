export function formatYearRange(startYear: number, endYear?: number): string {
  return endYear === undefined
    ? `${startYear}–Present`
    : `${startYear}–${endYear}`;
}

export { filterProjects } from "./filter-projects.js";
export type {
  ProjectFilterOptions,
  SearchableProject,
} from "./filter-projects.js";

export {
  contactFieldNames,
  contactFormLimits,
  createContactSchema,
  validateContactForm,
} from "./contact-form.js";
export type {
  ContactFieldErrors,
  ContactFieldName,
  ContactFormValues,
  ContactValidationMessages,
  ContactValidationResult,
} from "./contact-form.js";
export { createRateLimiter } from "./rate-limit.js";
export type { RateLimitResult, RateLimiterOptions } from "./rate-limit.js";
export {
  absoluteUrl,
  createPageMetadata,
  createPersonJsonLd,
  createRobots,
  createRootMetadata,
  createSitemap,
  resolveSiteUrl,
  serializeJsonLd,
} from "./seo.js";
export type {
  PageMetadataOptions,
  PersonJsonLdOptions,
  RobotsOptions,
  SiteConfig,
  SitemapRoute,
  SocialImage,
  SiteUrlEnv,
} from "./seo.js";
export {
  ALL_CATEGORIES,
  buildProjectSearchHref,
  parseProjectSearchParams,
} from "./project-search-params.js";
export type {
  ProjectSearchState,
  ReadableSearchParams,
} from "./project-search-params.js";
