import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["react-simple-maps"],
  experimental: {
    // Required for MUI with Next.js App Router
    optimizePackageImports: [
      "@mui/material",
      "@mui/icons-material",
      "lucide-react",
    ],
  },
  // Proxy /api/* to backend. API_URL is a server-only runtime env var (not baked into
  // the client bundle). Client code uses relative /api/* paths so requests route through
  // this proxy, eliminating CORS entirely. Next.js API routes (/api/health, /api/check-url)
  // take precedence over rewrites so they are never forwarded to the backend.
  async rewrites() {
    const backendUrl = process.env.API_URL || "http://localhost:8000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  // Allow images from the backend domain
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
