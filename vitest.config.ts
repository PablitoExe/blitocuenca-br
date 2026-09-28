import path from 'node:path'
import { defineConfig } from 'vitest/config'

// Config separada de vite.config.ts: el plugin de React Router no debe cargarse en los tests.
export default defineConfig({
  resolve: {
    alias: { '~': path.resolve(import.meta.dirname, 'src') },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
})
