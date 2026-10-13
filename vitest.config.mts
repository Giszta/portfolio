import { basename } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";

const staticImageStub: Plugin = {
  name: "static-image-stub",
  enforce: "pre",
  load(id) {
    if (!/\.(png|jpe?g|webp|avif)$/.test(id)) return null;
    const image = {
      src: `/${basename(id)}`,
      width: 1600,
      height: 900,
      blurDataURL: "data:image/png;base64,iVBORw0KGgo=",
    };
    return `export default ${JSON.stringify(image)};`;
  },
};

export default defineConfig({
  plugins: [react(), staticImageStub],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup/vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
    server: {
      deps: {
        inline: ["next-intl"],
      },
    },
  },
});