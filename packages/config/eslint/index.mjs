import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

export const baseConfig = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
];

export const nextConfig = {
  plugins: {
    "@next/next": nextPlugin,
  },
  settings: {
    // Lets Next's rules find the apps whether ESLint runs inside an app
    // (`pnpm lint`) or from the repo root (lint-staged in the pre-commit hook).
    next: { rootDir: ["apps/*/", "./"] },
  },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs["core-web-vitals"].rules,
  },
};
