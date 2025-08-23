/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações de produção otimizadas
  reactStrictMode: true,
  swcMinify: true,
  
  // Desabilitar ESLint durante build para deploy inicial
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Desabilitar TypeScript checking durante build para deploy inicial
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Performance
  compress: true,
  poweredByHeader: false,
  
  // Configurações de build otimizadas
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      'react-apexcharts',
      'leaflet',
      'react-leaflet'
    ],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Configurações de imagem
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '138.197.121.81',
        pathname: '/storage/**',
      },
    ],
  },

  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' http://138.197.121.81 https://www.google-analytics.com",
              "frame-src 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // Configurações de webpack otimizadas
  webpack: (config, { isServer, dev }) => {
    // Otimizações para produção
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
          },
          mui: {
            test: /[\\/]node_modules[\\/]@mui[\\/]/,
            name: 'mui',
            priority: 20,
            reuseExistingChunk: true,
          },
          charts: {
            test: /[\\/]node_modules[\\/](apexcharts|react-apexcharts)[\\/]/,
            name: 'charts',
            priority: 20,
            reuseExistingChunk: true,
          },
          maps: {
            test: /[\\/]node_modules[\\/](leaflet|react-leaflet)[\\/]/,
            name: 'maps',
            priority: 20,
            reuseExistingChunk: true,
          },
        },
      };
    }

    // Configurações específicas para cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // Configurações de redirecionamentos
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/analytics',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/profile',
        permanent: false,
      },
    ];
  },

  // Configurações de reescrita
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://138.197.121.81/api/:path*',
      },
    ];
  },

  // Configurações de output
  output: 'standalone',
  
  // Configurações de cache
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // Configurações de bundle analyzer (desabilitado em prod)
  bundleAnalyzer: {
    enabled: process.env.ANALYZE === 'true',
  },
};

export default nextConfig;
