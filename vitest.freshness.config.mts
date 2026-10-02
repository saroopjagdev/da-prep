import path from "node:path";
import { defineConfig } from "vitest/config";

// Separate from vitest.config.mts so `npm test` never includes the date-based freshness check.
export default defineConfig({
  resolve: { alias: { "@": path.resolve(import.meta.dirname) } },
  test: { include: ["scripts/**/*.check.ts"] },
});
