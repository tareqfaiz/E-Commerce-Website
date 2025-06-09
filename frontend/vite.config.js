import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  logLevel: 'info',
  esbuild: {
    logOverride: {
      'this-is-undefined-in-esm': 'silent',
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
  define: {
    'process.env': {},
  },
  optimizeDeps: {
    exclude: ['react-router-dom'],
  },
})
