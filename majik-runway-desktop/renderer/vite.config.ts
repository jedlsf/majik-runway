import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@thezelijah/majik-runway": isProd
          ? "@thezelijah/majik-runway"
          : path.resolve(__dirname, "../../majik-runway/src"),
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
