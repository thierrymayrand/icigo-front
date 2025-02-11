import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/prestataires': {
        target: 'http://localhost:5088',
        changeOrigin: true,
      },
      '/activitees': {
        target: 'http://localhost:5088',
        changeOrigin: true,
      }
    }
  }
})
