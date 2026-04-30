import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'standalone',
	experimental: {
		// Required for MUI with Next.js App Router
		optimizePackageImports: ['@mui/material', '@mui/icons-material', 'lucide-react']
	},
	// Proxy /api requests to the backend (matches current Vite proxy behavior)
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}/api/:path*`
			}
		];
	},
	// Allow images from the backend domain
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**'
			}
		]
	}
};

export default nextConfig;
