import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
        input: './input.html',
        dashboard: './dashboard.html',
        suggestions: './suggestions.html'
      }
    }
  },
  server: {
    open: true
  }
})
