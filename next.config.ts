import { execSync } from "node:child_process";

import type { NextConfig } from "next";

import pkg from "./package.json";

/**
 * Build-time app version stamped into Faro RUM (`app.version`) so a frontend
 * regression can be correlated to a release in Grafana — matching the backend's
 * git-SHA `service.version`. Priority: explicit env (set by the deploy pipeline)
 * → short git SHA (host build) → package.json version (Docker build without git).
 */
function resolveAppVersion(): string {
  if (process.env.NEXT_PUBLIC_FARO_APP_VERSION) {
    return process.env.NEXT_PUBLIC_FARO_APP_VERSION;
  }
  try {
    return execSync("git rev-parse --short HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return pkg.version;
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  // Exposed to the client bundle so FrontendObservability can stamp the release
  // onto Faro RUM. See resolveAppVersion above.
  env: {
    NEXT_PUBLIC_FARO_APP_VERSION: resolveAppVersion(),
  },
  experimental: {
    // Required for MUI with Next.js App Router
    optimizePackageImports: [
      "@mui/material",
      "@mui/icons-material",
      "lucide-react",
      "lodash",
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
