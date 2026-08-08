"use client";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { LazyMotion, domAnimation } from "framer-motion";
import { QueryClientProvider } from "@tanstack/react-query";
import { enUS } from "date-fns/locale/en-US";
import { ptBR } from "date-fns/locale/pt-BR";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import { Auth0Provider } from "@auth0/nextjs-auth0/client";

import { initI18n, detectAndApplyLanguage } from "@/lib/i18n/config";
import { captureFirstTouch } from "@/lib/telemetry/firstTouch";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { LayoutProvider } from "@/shared/layout/core";
import { MainThemeProvider, applyGlobalStyles } from "@/lib/theme";
import { queryClient } from "@/lib/query/client";
import { MessageProvider } from "@/lib/providers/MessageProvider";
import AppContext from "@/lib/providers/AppContext";

interface ProvidersProps {
  children: React.ReactNode;
  initialLang?: string;
}

export function Providers({ children, initialLang = "en" }: ProvidersProps) {
  const didInit = useRef(false);
  if (!didInit.current) {
    initI18n(initialLang);
    didInit.current = true;
  }

  const { i18n } = useTranslation();
  const dateLocale = i18n.language === "pt-BR" ? ptBR : enUS;
  const val = useMemo(() => ({}), []);

  useEffect(() => {
    applyGlobalStyles();
    detectAndApplyLanguage();
    // Grava a origem da primeira visita (gclid/utm/referrer) antes de qualquer
    // navegação SPA descartar a query string — consumida no auth0-exchange.
    captureFirstTouch();
  }, []);

  return (
    <Auth0Provider>
      <QueryClientProvider client={queryClient}>
        <AppContext.Provider value={val}>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={dateLocale}
          >
            <AuthProvider>
              <LayoutProvider>
                <MainThemeProvider>
                  <MessageProvider>
                    {/* The `<Message />` view is NOT mounted here: it reads
                        `useTheme()`, and this provider sits above the route
                        tree — above the `(app)` group's nested `AppThemeScope`
                        light-theme override — so a toast rendered at this
                        level would always paint dark, even on light-mode
                        logged pages. Each route-group layout mounts its own
                        `<Message />` instead, under the theme that actually
                        applies to it (see `app/(app|public|auth)/layout.tsx`). */}
                    {/* strict: only the lightweight `m` component is allowed
                        (full `motion` would defeat the lazy feature split). */}
                    <LazyMotion features={domAnimation} strict>
                      {children}
                    </LazyMotion>
                  </MessageProvider>
                </MainThemeProvider>
              </LayoutProvider>
            </AuthProvider>
          </LocalizationProvider>
        </AppContext.Provider>
      </QueryClientProvider>
    </Auth0Provider>
  );
}
