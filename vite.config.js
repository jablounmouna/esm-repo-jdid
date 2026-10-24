import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: "/esm-repo-jdid/", // 🔥 مهم برشة (اسم repo)

  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8002', // ❗ صحّحنا الرابط (نحي markdown)
        changeOrigin: true,
      },
    },
  },
})