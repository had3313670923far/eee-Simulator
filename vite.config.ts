import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
 * The dev/preview servers bind 0.0.0.0 and accept any Host header so the app
 * works behind proxies and sandboxed preview URLs (https://{port}-{id}.e2b.app).
 */
const server = {
  host: "0.0.0.0" as const,
  port: 5173,
  strictPort: false,
  allowedHosts: true as const,
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server,
  preview: { ...server, port: 4173 },
});
