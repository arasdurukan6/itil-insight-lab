import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  base: '/itil-insight-lab/',
  tanstackStart: {
    server: { entry: "server" },
  },
});
