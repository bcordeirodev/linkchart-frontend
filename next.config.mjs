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
	// Pages Router - sem experimental appDir
	webpack: (config) => {
		if (config.module && config.module.rules) {
			config.module.rules.push({
				test: /\.(json|js|ts|tsx|jsx)$/,
				resourceQuery: /raw/,
				use: 'raw-loader'
			});
		}

		return config;
	}
};

export default nextConfig;
