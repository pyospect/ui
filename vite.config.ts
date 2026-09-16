import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  // GitHub Pages serves the site under /pyospectui/. set BASE_PATH=/ for a custom domain.
  base: process.env.BASE_PATH ?? "/pyospectui/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
})
