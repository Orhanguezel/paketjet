import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    include: ["src/**/*.test.{ts,tsx}"],
    // Marka ad ortamdan gelir; testler sabit bir dagitim adiyla kosar.
    env: { NEXT_PUBLIC_APP_NAME: "PaketJet", NEXT_PUBLIC_SITE_URL: "https://paketjet.com" },
  },
});
