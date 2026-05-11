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
  // Forward /r/{slug} hits on the app domain to the canonical redirect host so the
  // backend (web.php) serves the 302 and dispatches ProcessLinkClickJob. A 307 (not a
  // rewrite) is used so the browser actually navigates and the backend sees the real
  // client IP for geo/tracking enrichment.
  async redirects() {
    const redirectBase = (
      process.env.NEXT_PUBLIC_REDIRECT_URL ?? "http://localhost:8000/r"
    ).replace(/\/$/, "");
    return [
      {
        source: "/r/:slug",
        destination: `${redirectBase}/:slug`,
        permanent: false,
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
