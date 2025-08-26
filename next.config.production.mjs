/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações básicas
  reactStrictMode: true,
  swcMinify: true,
  
  // Desabilitar verificações para deploy inicial
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Performance
  compress: true,
  poweredByHeader: false,
  
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

  // Headers de segurança simplificados
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
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' http://138.197.121.81",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // Configurações de webpack simplificadas
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Configurações específicas para resolver problemas de clientModules
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    
    return config;
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

  // Output standalone para Docker
  output: 'standalone',
  
  // Configurações de build otimizadas
  swcMinify: true,
  compress: true,
  
  // Configurações específicas para Next.js 15
  experimental: {
    serverComponentsExternalPackages: [],
    trace: false,
  },
};

export default nextConfig;
