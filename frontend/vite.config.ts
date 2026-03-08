import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  define: {
    '__VITE_API_BASE_URL__': JSON.stringify(process.env.VITE_API_BASE_URL || 'http://localhost:3000'),
    '__VITE_API_VERSION__': JSON.stringify(process.env.VITE_API_VERSION || 'v1'),
  }
})

/**
 * ENVIRONMENT CONFIGURATION:
 * 
 * Development:
 *   VITE_API_BASE_URL = http://localhost:3000 (from .env.development)
 * 
 * Production (Vercel):
 *   VITE_API_BASE_URL = https://autodetail-pro-backend.onrender.com (from .env.production)
 * 
 * Auto-switch based on import.meta.env.MODE
 */
