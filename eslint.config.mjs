import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "Sci-Fi Space Game Menu/**",
    "mission-survival-terminal/**",
    "Level 3_ Space Station Docking_files/**",
    "Unstable Orbits Simulation — Orbital Academy_files/**",
  ]),
]);

export default eslintConfig;
