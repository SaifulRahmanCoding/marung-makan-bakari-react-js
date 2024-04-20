/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@services': path.resolve(__dirname, './src/services'),
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        // target: 'https://151e-180-245-51-64.ngrok-free.app',
        changeOrigin: true,
        rewrite: (path) => path.replace('^/api/', ''),
      }
    }
  }
})
