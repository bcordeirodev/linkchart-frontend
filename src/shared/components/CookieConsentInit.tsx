// src/shared/components/CookieConsentInit.tsx
'use client'

import { useEffect } from 'react'
import CookieConsent from 'vanilla-cookieconsent'
import { cookieConsentConfig } from '@/lib/consent/cookie-consent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'

export function CookieConsentInit() {
  useEffect(() => {
    CookieConsent.run(cookieConsentConfig)
  }, [])

  return null
}
