/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	eslint: {
		// Only enable ESLint in development
		ignoreDuringBuilds: process.env.NODE_ENV === 'production'
	},
	typescript: {
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		ignoreBuildErrors: true
	},
	// Docker/Container configuration - Standalone habilitado para produção
	output: process.env.NODE_ENV === 'production' && process.env.STANDALONE === 'true' ? 'standalone' : undefined,

	// Otimizações para client modules e performance
	experimental: {
		// Otimizar imports de bibliotecas
		optimizePackageImports: ['@mui/material', '@mui/icons-material', 'lodash'],
		// Melhor tree-shaking
		esmExternals: true,
		// Desabilitar features experimentais problemáticas
		serverActions: {
			allowedOrigins: ['localhost:3000', 'localhost:3001', 'localhost:3002']
		}
	},

	// Fix para clientModules no Next.js 15 - removido temporariamente
	// serverExternalPackages: ['@mui/material', '@mui/icons-material'],

	// Configurações de bundle
	compiler: {
		// Remove console.logs em produção
		removeConsole:
			process.env.NODE_ENV === 'production'
				? {
						exclude: ['error', 'warn']
					}
				: false
	},

	webpack: (config, { dev, isServer }) => {
		// Raw loader para arquivos específicos
		if (config.module && config.module.rules) {
			config.module.rules.push({
				test: /\.(json|js|ts|tsx|jsx)$/,
				resourceQuery: /raw/,
				use: 'raw-loader'
			});
		}

		// Otimizações para client modules
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				net: false,
				tls: false
			};
		}

		// Otimizar chunks em produção
		if (!dev) {
			config.optimization = {
				...config.optimization,
				splitChunks: {
					...config.optimization.splitChunks,
					cacheGroups: {
						...config.optimization.splitChunks.cacheGroups,
						// Separar vendor chunks
						vendor: {
							test: /[\\/]node_modules[\\/]/,
							name: 'vendors',
							chunks: 'all',
							priority: 10
						},
						// Separar Material-UI
						mui: {
							test: /[\\/]node_modules[\\/]@mui[\\/]/,
							name: 'mui',
							chunks: 'all',
							priority: 20
						},
						// Separar componentes comuns
						common: {
							name: 'common',
							minChunks: 2,
							chunks: 'all',
							priority: 5
						}
					}
				}
			};
		}

		return config;
	}
};

export default nextConfig;
