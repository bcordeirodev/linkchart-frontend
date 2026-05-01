"use client";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { enUS } from "date-fns/locale/en-US";
import { ptBR } from "date-fns/locale/pt-BR";
import { SnackbarProvider } from "notistack";
import { useMemo, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { useTranslation } from "react-i18next";
import { BrowserRouter, MemoryRouter } from "react-router-dom";

import "@/i18n/config";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { LayoutProvider } from "@/shared/layout/core";
import { MainThemeProvider, applyGlobalStyles } from "@/lib/theme";
import store from "@/lib/store/store";
import AppContext from "@/lib/AppContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const dateLocale = i18n.language === "pt-BR" ? ptBR : enUS;
  const val = useMemo(() => ({}), []);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (typeof window !== "undefined") {
    applyGlobalStyles();
  }

  return (
    <AppContext.Provider value={val}>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={dateLocale}
      >
        <Provider store={store}>
          <AuthProvider>
            <LayoutProvider>
              <MainThemeProvider>
                <SnackbarProvider
                  maxSnack={5}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  style={{ zIndex: 99 }}
                >
                  {/* Router: BrowserRouter after hydration, MemoryRouter during SSR */}
                  {isMounted ? (
                    <BrowserRouter>{children}</BrowserRouter>
                  ) : (
                    <MemoryRouter>{children}</MemoryRouter>
                  )}
                </SnackbarProvider>
              </MainThemeProvider>
            </LayoutProvider>
          </AuthProvider>
        </Provider>
      </LocalizationProvider>
    </AppContext.Provider>
  );
}
