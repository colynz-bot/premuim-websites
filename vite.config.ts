import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const page = (path: string) => fileURLToPath(new URL(path, import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Bulgarian at "/", English at "/en/": both pages load the same app.
    rolldownOptions: {
      input: {
        bg: page('./index.html'),
        en: page('./en/index.html'),
      },
    },
  },
})
