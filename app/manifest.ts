import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Link Charts",
    short_name: "Link Charts",
    description:
      "Free URL shortener with real-time analytics, click tracking, and geographic insights.",
    start_url: "/",
    display: "standalone",
    // Aligned to the app's dark chrome: background = darkNeutral.bg (#0A0A0B),
    // theme_color = darkPrimary.main (#4E82E6). See src/lib/theme/colors/dark.ts.
    background_color: "#0A0A0B",
    theme_color: "#4E82E6",
    icons: [
      // "any" variants cover contexts that crop maskable icons (e.g. favicons,
      // browser tabs); "maskable" variants supply the safe-zone padding Android
      // adaptive icons require.
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
