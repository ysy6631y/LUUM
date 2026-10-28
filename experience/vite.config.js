import { defineConfig } from "vite";
export default defineConfig({
  base: "/LUUM/",
  server: { port: 5173, strictPort: true },
  build: { target: "es2022" },
});
