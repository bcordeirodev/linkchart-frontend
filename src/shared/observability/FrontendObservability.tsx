"use client";

import {
  faro,
  getWebInstrumentations,
  initializeFaro,
} from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";

/**
 * Initializes Grafana Faro exactly once on the client. Captures Web Vitals,
 * JS errors, and (via TracingInstrumentation) patches global fetch to inject a
 * W3C `traceparent` header on same-origin `/api/*` calls, continuing the trace
 * into the Laravel backend. Renders nothing. Silently no-ops on the server,
 * when already initialized, or when NEXT_PUBLIC_FARO_URL is unset, so it can
 * never break the app.
 */
export default function FrontendObservability(): null {
  if (typeof window === "undefined" || faro.api) {
    return null;
  }

  const url = process.env.NEXT_PUBLIC_FARO_URL;
  if (!url) {
    return null;
  }

  try {
    initializeFaro({
      url,
      app: {
        name: process.env.NEXT_PUBLIC_FARO_APP_NAME ?? "linkcharts-frontend",
        version: "0.1.0",
        environment: process.env.NODE_ENV,
      },
      instrumentations: [
        ...getWebInstrumentations(),
        new TracingInstrumentation({
          instrumentationOptions: {
            // Propagate traceparent to same-origin API calls (the /api proxy).
            propagateTraceHeaderCorsUrls: [
              new RegExp(`${window.location.origin}/api/.*`),
            ],
          },
        }),
      ],
    });
  } catch {
    // Faro must never break the app.
  }

  return null;
}
