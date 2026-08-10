import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Base path: '/' works for a custom domain (sweetfix.nz) and for a
// <user>.github.io repo. If this ever gets served from a project subpath
// (e.g. milkysbeta.github.io/sweetfix/), set BASE_PATH in the workflow.
export default defineConfig({
  base: loadEnv('', '.', 'BASE').BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 2048,
  },
})
