"use client";

import { useEffect } from "react";
import {
  getWebInstrumentations,
  initializeFaro,
  isInternalFaroOnGlobalObject,
} from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";

/**
 * Initializes Grafana Faro exactly once on the client, inside an effect so the
 * side effect (patching global fetch, registering the Faro singleton) never
 * runs during render. Captures Web Vitals, JS errors, and — via
 * TracingInstrumentation — injects a W3C `traceparent` header on same-origin
 * `/api/*` calls, continuing the trace into the Laravel backend. Same-origin
 * propagation is automatic in OpenTelemetry's web tracer, so no CORS allow-list
 * is configured (an allow-list here only affects cross-origin requests and,
 * unanchored, risks leaking trace headers to third parties).
 *
 * Renders nothing. No-ops when Faro is already initialized (guarded via Faro's
 * own `isInternalFaroOnGlobalObject`, which is false before init) or when
 * NEXT_PUBLIC_FARO_URL is unset, and never throws, so it can never break the app.
 */
export default function FrontendObservability(): null {
  useEffect(() => {
    if (isInternalFaroOnGlobalObject()) {
      return;
    }

    const url = process.env.NEXT_PUBLIC_FARO_URL;
    if (!url) {
      return;
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
          new TracingInstrumentation(),
        ],
      });
    } catch {
      // Faro must never break the app.
    }
  }, []);

  return null;
}
