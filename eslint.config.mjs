// Root-level files only (e.g. lighthouserc.cjs). Every workspace package has
// its own eslint.config.mjs, and ESLint uses the config nearest to each file.
export default [
  {
    files: ["*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        module: "writable",
        require: "readonly",
        process: "readonly",
        __dirname: "readonly",
      },
    },
  },
];
