// src/shared/components/CookieConsentInit.tsx
"use client";

import { useEffect } from "react";
import * as CookieConsent from "@/lib/consent/cookieconsent.esm.js";
import { cookieConsentConfig } from "@/lib/consent/cookie-consent";

export function CookieConsentInit() {
  useEffect(() => {
    CookieConsent.run(cookieConsentConfig);
  }, []);

  return null;
}
