import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  base: '/itil-insight-lab/',
  tanstackStart: {
    spa: true,
    server: { entry: "server" },
  },
});
