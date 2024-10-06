import { resolve } from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import Unocss from "unocss/vite"

export default defineConfig({
  plugins: [
    react(),
    Unocss(),
  ],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        preview: resolve(__dirname, "preview.html"),
      },
    },
  },
})
