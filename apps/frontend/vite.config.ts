import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: { alias: { '@': '/src' } },
  plugins: [react()],
  preview: {
    port: 5173,
    strictPort: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // local nest app
        changeOrigin: true,
      },
      '/uploads': {
        // folder with uploaded files
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true,
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
  },
});
