import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    root: path.resolve(import.meta.dirname, 'frontend'),
    build: {
        outDir: path.resolve(import.meta.dirname, 'dist'),
        emptyOutDir: true,
    },
    server: {
        port: 5176,
        strictPort: false,
        host: '0.0.0.0',
        proxy: {
            '/api/lab': {
                target: 'http://127.0.0.1:8082',
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
