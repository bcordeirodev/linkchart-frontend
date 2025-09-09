import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',

        './src/themes/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
            },
        },
    },
    plugins: [
        // Plugin icon-size temporariamente desabilitado devido a incompatibilidade de módulos
        // require('./src/@fuse/tailwind/plugins/icon-size.js'),
    ],
    darkMode: 'class',
    important: true, // ✅ Força Tailwind a ter prioridade sobre MUI
    corePlugins: {
        preflight: false, // ✅ Desabilita reset CSS do Tailwind para não conflitar com MUI
    },
};

export default config;
