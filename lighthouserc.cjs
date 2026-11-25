// Lighthouse CI config. Runs against the production build of apps/portfolio,
// so `turbo run build` must have run first (CI does this).
const { projects } = require("./packages/content/dist/index.js");

const PORT = 3310;
const base = `http://localhost:${PORT}`;

/** @type {import("@lhci/cli").LighthouseCiConfig} */
module.exports = {
  ci: {
    collect: {
      startServerCommand: `pnpm --dir apps/portfolio exec next start -p ${PORT}`,
      startServerReadyPattern: "Ready",
      url: [
        `${base}/`,
        `${base}/projects`,
        `${base}/projects/${projects[0].slug}`,
        `${base}/resume`,
      ],
      numberOfRuns: 3,
      settings: {
        // Desktop profile: GitHub runners are too noisy for the simulated
        // mobile CPU to give stable scores (see docs/deployment.md).
        preset: "desktop",
        chromeFlags: "--no-sandbox --headless=new",
      },
    },
    assert: {
      assertions: {
        "categories:performance": [
          "error",
          { minScore: 0.9, aggregationMethod: "median-run" },
        ],
        "categories:accessibility": [
          "error",
          { minScore: 0.95, aggregationMethod: "median-run" },
        ],
        "categories:seo": [
          "error",
          { minScore: 0.95, aggregationMethod: "median-run" },
        ],
        "categories:best-practices": [
          "warn",
          { minScore: 0.9, aggregationMethod: "median-run" },
        ],
      },
    },
    upload: {
      // Keep reports private: saved to disk and uploaded as a workflow
      // artifact instead of LHCI's public temporary storage.
      target: "filesystem",
      outputDir: "./.lighthouseci/reports",
    },
  },
};
