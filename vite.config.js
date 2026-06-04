import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // Security and performance optimizations
  server: {
    // Restrict file access in dev server
    fs: {
      strict: true,
      allow: ['src', 'public', 'node_modules'],
    },
    // Disable middleware mode for security
    middlewareMode: false,
  },

  build: {
    // Generate source maps for production debugging (optional)
    sourcemap: false,
    
    // Minify output
    minify: 'terser',
    
    // Terser options for better security
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },

    // Rollup options
    rollupOptions: {
      output: {
        // Ensure consistent chunk naming
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]',
      },
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
