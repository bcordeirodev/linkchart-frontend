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
            // Main aliases
            '@': path.resolve(__dirname, './src'),
            '@/shared': path.resolve(__dirname, './src/shared'),
            '@/features': path.resolve(__dirname, './src/features'),
            '@/lib': path.resolve(__dirname, './src/lib'),
            '@/app': path.resolve(__dirname, './src/app'),

            // Feature aliases
            '@/auth': path.resolve(__dirname, './src/features/auth'),
            '@/analytics': path.resolve(__dirname, './src/features/analytics'),
            '@/links': path.resolve(__dirname, './src/features/links'),
            '@/profile': path.resolve(__dirname, './src/features/profile'),
            '@/redirect': path.resolve(__dirname, './src/features/redirect'),

            // Shared aliases
            '@/ui': path.resolve(__dirname, './src/shared/ui'),
            '@/layout': path.resolve(__dirname, './src/shared/layout'),
            '@/hooks': path.resolve(__dirname, './src/shared/hooks'),

            // Lib aliases
            '@/api': path.resolve(__dirname, './src/lib/api'),
            '@/theme': path.resolve(__dirname, './src/lib/theme'),
            '@/store': path.resolve(__dirname, './src/lib/store'),
            '@/utils': path.resolve(__dirname, './src/lib/utils'),
            '@/i18n': path.resolve(__dirname, './src/lib/i18n'),


            '@history': path.resolve(__dirname, './src/@history'),
            '@mock-utils': path.resolve(__dirname, './src/@mock-utils'),
            '@schema': path.resolve(__dirname, './src/@schema'),
            'src': path.resolve(__dirname, './src'),
        },
    },
    define: {
        global: 'globalThis',
        'process.env': {},
        // Fix para ApexCharts
        'window.ApexCharts': 'undefined',
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
            // Chart libraries
            'apexcharts',
            'react-apexcharts',
        ],
        exclude: [
            // Evitar problemas de SSR/CSR
        ],
    },
});
