import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:3000',
      '/api': 'http://localhost:3000',
      '/upload': 'http://localhost:3000',
      '/admin': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000'
    }
  }
})
