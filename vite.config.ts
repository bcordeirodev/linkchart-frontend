import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            jsxImportSource: '@emotion/react',
            babel: {
                plugins: ['@emotion/babel-plugin'],
            },
        }),
        tsconfigPaths(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@auth': path.resolve(__dirname, './src/@auth'),
            '@i18n': path.resolve(__dirname, './src/@i18n'),
            '@fuse': path.resolve(__dirname, './src/@fuse'),
            '@history': path.resolve(__dirname, './src/@history'),
            '@mock-utils': path.resolve(__dirname, './src/@mock-utils'),
            '@schema': path.resolve(__dirname, './src/@schema'),
            'src': path.resolve(__dirname, './src'),
        },
    },
    define: {
        global: 'globalThis',
        'process.env': {},
    },
    server: {
        port: 3000,
        host: true,
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    mui: ['@mui/material', '@mui/icons-material', '@mui/system'],
                    charts: ['apexcharts', 'react-apexcharts'],
                    maps: ['leaflet', 'react-leaflet'],
                },
            },
        },
    },
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
            'react-router-dom',
        ],
    },
});
