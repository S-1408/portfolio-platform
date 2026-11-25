import { baseConfig } from "@repo/config/eslint";
import { globalIgnores } from "eslint/config";

export default [
  ...baseConfig,
  globalIgnores(["test-results/**", "playwright-report/**"]),
];
