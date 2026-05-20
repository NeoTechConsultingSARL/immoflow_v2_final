import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
    ],
    esbuild: {
        loader: "tsx",
        include: /\.(tsx|ts)$/,
        exclude: /node_modules/,
    },
    server: {
        proxy: {
            '/login': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
            },
            '/logout': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
            },
            '/dashboard': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
            },
        }
    }
});
