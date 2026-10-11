import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { defineConfig } from 'vite';
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  preview: {
    allowedHosts: ['wida.onrender.com', '.onrender.com', 'localhost', '127.0.0.1'],
  },
  server: {
    allowedHosts: ['wida.onrender.com', '.onrender.com', 'localhost', '127.0.0.1'],
    proxy: {
      '/api/lab': {
        target: 'http://127.0.0.1:8082',
        changeOrigin: true,
      },
      '/api/doctor': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  }
});
