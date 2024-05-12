import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/movies" : "http://localhost:8888",
      "/prompt" : "http://localhost:8888",
      "/movieStreams" : "http://localhost:8888",
      "/movieTomatoes" : "http://localhost:8888"
    }
  }
})
