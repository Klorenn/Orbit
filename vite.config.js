import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.js'],
    globals: true,
  },
  build: {
    chunkSizeWarningLimit: 1400,
    rolldownOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'INVALID_ANNOTATION') return
        if (warning.code === 'EVAL') return
        warn(warning)
      },
    },
  },
})
