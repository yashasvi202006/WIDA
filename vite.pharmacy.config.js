import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
    plugins: [react()],
    root: path.resolve(import.meta.dirname, 'feature/pharmacy'),
    build: {
        outDir: path.resolve(import.meta.dirname, 'dist-pharmacy'),
        emptyOutDir: true,
    },
    server: {
        port: 5175,
        strictPort: false,
        host: '127.0.0.1',
    },
});
