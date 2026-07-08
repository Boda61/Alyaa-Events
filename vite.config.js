import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      // Only process images that land in the dist bundle (imported via JS/CSS).
      // Public-folder images are already pre-compressed by our script.
      // This catches any image imported directly in JSX/CSS.
      jpg:  { quality: 82, progressive: true },
      jpeg: { quality: 82, progressive: true },
      png:  { quality: [0.8, 0.9] },
      webp: { quality: 80 },
    }),
  ],
  build: {
    target: 'es2015',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/firebase')) return 'firebase';
          if (id.includes('node_modules/framer-motion')) return 'vendor-motion';
          if (id.includes('node_modules/phosphor-react')) return 'vendor-icons';
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-router')) return 'vendor-router';
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor-react';
          if (id.includes('node_modules/@tanstack')) return 'vendor-query';
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'phosphor-react'],
  },
})
