import { profile } from "./profile.js";
import type { ResumeContent } from "./types.js";

export const resumeContent: ResumeContent = {
  title: "Resume",
  metaDescription: `Resume of ${profile.name}, ${profile.role} based in ${profile.location}.`,
  summaryHeading: "Summary",
  summary: [
    `${profile.role} with ${profile.yearsOfExperience}+ years of experience building accessible, high-performance web applications with React, Next.js, and TypeScript.`,
    "Experienced in enterprise products for clients such as Hitachi Building Systems and Mercedes-Benz R&D India, covering reusable component libraries, role-based access control, REST API integrations, and internationalization.",
  ],
  pdfPath: profile.resumePath,
  downloadFileName: "sonam-verma-resume.pdf",
  downloadLabel: "Download PDF",
  openInNewTabLabel: "Open in new tab",
  viewerHeading: "Resume preview",
  viewerTitle: `${profile.name} resume (PDF)`,
  fallbackMessage: "Your browser can't display the PDF here.",
  fallbackLinkLabel: "Download the resume instead",
};
