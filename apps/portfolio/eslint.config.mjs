import { baseConfig, nextConfig } from "@repo/config/eslint";
import { globalIgnores } from "eslint/config";

export default [
  ...baseConfig,
  nextConfig,
  globalIgnores([".next/**", ".next-analyze/**", "next-env.d.ts"]),
];
