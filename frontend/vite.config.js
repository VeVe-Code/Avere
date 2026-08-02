import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // TipTap / multiple React copies → Invalid hook call (useRef)
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tiptap/react',
      '@tiptap/starter-kit',
      '@tiptap/extension-link',
      '@tiptap/extension-underline',
      '@tiptap/extension-placeholder',
    ],
  },
  build: {
    // Keep production bundles without source maps (no original .jsx in DevTools)
    sourcemap: false,
  },
  server: {
    host: true,
    allowedHosts: true,
    hmr: {
      host: 'localhost',
      protocol: 'wss',
    },
  },
})
