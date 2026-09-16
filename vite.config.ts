import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  // custom domain ui.pyospect.com serves at /. BASE_PATH is set in the Pages workflow; local dev falls back to /ui/.
  base: process.env.BASE_PATH ?? "/ui/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
})
