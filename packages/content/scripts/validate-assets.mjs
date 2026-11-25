import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  portfolioCopy,
  profile,
  projects,
  resumeContent,
} from "../dist/index.js";

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const publicRoot = resolve(repositoryRoot, "apps/portfolio/public");
const assetPaths = [
  profile.photo,
  profile.resumePath,
  resumeContent.pdfPath,
  portfolioCopy.logoPath,
  ...projects.map((project) => project.image),
];

for (const assetPath of assetPaths) {
  const relativePath = assetPath.replace(/^\/+/, "");

  if (relativePath.split(/[\\/]/).includes("..")) {
    throw new Error(`Invalid public asset path in content: ${assetPath}`);
  }

  const resolvedPath = resolve(publicRoot, relativePath);

  if (!existsSync(resolvedPath)) {
    throw new Error(
      `Public asset referenced by content does not exist: ${assetPath}`,
    );
  }
}
