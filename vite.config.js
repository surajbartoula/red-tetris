import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Enables JSX and Fast-Refresh for React
  plugins: [react()],

  // Development server layout
  server: {
    port: 8080,
    host: "0.0.0.0",
  },

  // Production build target directory
  build: {
    outDir: "dist/client",
  },

  // Vitest Suite and Coverage Engine Configuration
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      include: ["src/**/*"],
      exclude: ["src/server/main.js"], // Exclude the raw server entry point wrapper

      // Red-tetris subject Limits
      thresholds: {
        statements: 70,
        functions: 70,
        lines: 70,
        branches: 50,
      },

      // Generates a terminal readout and an interactive HTML report
      reporter: ["text", "lcov"],
    },
  },
});
