'use client'

import {
  getWebInstrumentations,
  initializeFaro,
  isInternalFaroOnGlobalObject
} from '@grafana/faro-web-sdk'
import { TracingInstrumentation } from '@grafana/faro-web-tracing'
import { useEffect } from 'react'

import type { BeforeSendHook } from '@grafana/faro-web-sdk'

/** Object keys whose values are always redacted (case-insensitive match). */
const SENSITIVE_KEY = /(authorization|token|password|secret|api[_-]?key|email)/i

/**
 * Drops query strings and redacts sensitive keys from a Faro payload before it
 * leaves the browser. Query params are the main vector for tokens/PII leaking
 * into RUM (URLs, referrers), and auth/email fields must never reach Grafana.
 *
 * Fail-open: any error returns the item unchanged, so the scrub can never break
 * telemetry (which in turn can never break the app).
 */
const scrubPii: BeforeSendHook = (item) => {
  try {
    const walk = (node: unknown, depth: number): void => {
      if (depth > 6 || node === null || typeof node !== 'object') {
        return
      }
      for (const [key, value] of Object.entries(
        node as Record<string, unknown>
      )) {
        if (typeof value === 'string') {
          if (SENSITIVE_KEY.test(key)) {
            ;(node as Record<string, unknown>)[key] = '[redacted]'
          } else if (/^https?:\/\//i.test(value) && value.includes('?')) {
            ;(node as Record<string, unknown>)[key] = value.slice(
              0,
              value.indexOf('?')
            )
          }
        } else if (typeof value === 'object') {
          walk(value, depth + 1)
        }
      }
    }
    walk((item as { payload?: unknown }).payload, 0)
  } catch {
    // fail open — never drop telemetry because of a scrub error
  }
  return item
}

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
 * `app.version` is the build-time release (git SHA via next.config) so a
 * frontend regression can be correlated to a deploy in Grafana, matching the
 * backend's `service.version`. All payloads pass through `scrubPii` first.
 *
 * Renders nothing. No-ops when Faro is already initialized (guarded via Faro's
 * own `isInternalFaroOnGlobalObject`, which is false before init) or when
 * NEXT_PUBLIC_FARO_URL is unset, and never throws, so it can never break the app.
 */
export default function FrontendObservability(): null {
  useEffect(() => {
    if (isInternalFaroOnGlobalObject()) {
      return
    }

    const url = process.env.NEXT_PUBLIC_FARO_URL
    if (!url) {
      return
    }

    try {
      initializeFaro({
        url,
        app: {
          name: process.env.NEXT_PUBLIC_FARO_APP_NAME ?? 'linkcharts-frontend',
          version: process.env.NEXT_PUBLIC_FARO_APP_VERSION ?? '0.1.0',
          environment:
            process.env.NEXT_PUBLIC_FARO_ENVIRONMENT ?? process.env.NODE_ENV
        },
        beforeSend: scrubPii,
        instrumentations: [
          ...getWebInstrumentations(),
          new TracingInstrumentation()
        ]
      })
    } catch {
      console.warn('Uma falha ocorreu ao iniciar o Faro!')
    }
  }, [])

  return null
}
