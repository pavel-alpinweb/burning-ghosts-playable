import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import checker from "vite-plugin-checker";
import svgLoader from "vite-svg-loader";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    svgLoader(),
    checker({
      vueTsc: false,
    }),
  ],
  resolve: {
    alias: {
      // eslint-disable-next-line
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
