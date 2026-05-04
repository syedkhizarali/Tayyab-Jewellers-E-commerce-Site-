import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/products': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/users': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/orders': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/payments': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/wishlist': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/addresses': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/profile': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/rates': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/inventory': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
