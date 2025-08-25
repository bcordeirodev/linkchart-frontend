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
	// Next.js 15 uses App Router by default when src/app exists
	experimental: {},
	// Docker/Container configuration
	output: process.env.NODE_ENV === 'production' && process.env.STANDALONE === 'true' ? 'standalone' : undefined,
	// Configuração para proxies e redirecionamento
	async rewrites() {
		// Desabilitar rewrites em desenvolvimento para evitar problemas de proxy
		if (process.env.NODE_ENV === 'development') {
			return [];
		}
		
		return [
			{
				source: '/api/:path*',
				destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost'}/api/:path*`,
			},
		];
	},
	webpack: (config, { isServer }) => {
		if (config.module && config.module.rules) {
			config.module.rules.push({
				test: /\.(json|js|ts|tsx|jsx)$/,
				resourceQuery: /raw/,
				use: 'raw-loader'
			});
		}

		// Fix para ApexCharts
		config.resolve = config.resolve || {};
		config.resolve.fallback = {
			...config.resolve.fallback,
			fs: false,
			path: false,
		};

		// Melhorar configuração de chunks para evitar problemas com ApexCharts
		if (!isServer) {
			config.optimization = config.optimization || {};
			config.optimization.splitChunks = {
				...config.optimization.splitChunks,
				cacheGroups: {
					...config.optimization.splitChunks.cacheGroups,
					apexcharts: {
						test: /[\\/]node_modules[\\/](apexcharts|react-apexcharts)[\\/]/,
						name: 'apexcharts',
						chunks: 'all',
						priority: 10,
					},
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all',
						priority: 5,
					},
				},
			};
		}

		return config;
	}
};

export default nextConfig;
