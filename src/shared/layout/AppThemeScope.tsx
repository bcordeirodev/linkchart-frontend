"use client";
/**
 * Escopo de tema da área logada.
 *
 * Provider aninhado que sobrepõe o tema MUI global (dark) apenas na
 * subárvore `(app)`: recebe o modo inicial resolvido do cookie no servidor
 * — o HTML já sai no tema certo, sem flash e sem hydration mismatch — e
 * expõe `toggleMode`, que troca o tema em memória e persiste a escolha no
 * cookie `lc_theme`.
 *
 * Deliberadamente NÃO usa `LayoutProvider`/`changeTheme`: o efeito de
 * resync do provider legado (compara `data` com `calculateSettings()`)
 * reverteria a troca no render seguinte. Também NÃO cria um segundo
 * `CacheProvider` Emotion — o cache do root cobre esta subárvore.
 */
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { getMuiThemeByKey } from "@/lib/theme/hooks/fuseThemeHooks";
import {
  THEME_COOKIE_MAX_AGE,
  THEME_COOKIE_NAME,
} from "@/lib/theme/themeCookie";

import type { ThemeMode } from "@/lib/theme/themeCookie";
import type { ReactNode } from "react";

/** Valor exposto pelo contexto do escopo de tema da área logada. */
interface AppThemeModeContextValue {
  /** Modo ativo na subárvore logada. */
  mode: ThemeMode;
  /** Alterna light/dark e persiste a escolha no cookie. */
  toggleMode: () => void;
}

const AppThemeModeContext = createContext<AppThemeModeContextValue | null>(
  null,
);

/**
 * Lê o escopo de tema da área logada.
 *
 * @returns `{mode, toggleMode}` dentro do `AppThemeScope`; `null` fora dele
 * (layouts públicos/auth) — consumidores opcionais, como o toggle do
 * Navbar, usam o `null` para se esconder.
 */
export function useAppThemeMode(): AppThemeModeContextValue | null {
  return useContext(AppThemeModeContext);
}

/**
 * Persiste a preferência de tema no cookie legível pelo servidor.
 *
 * Anexa `; Secure` apenas quando servido por https — `document.cookie` não
 * aceita o atributo `Secure` em `http://localhost`, o que quebraria a
 * escrita do cookie (e, por consequência, a persistência do tema) no dev
 * local.
 *
 * @param mode - modo a gravar no cookie `lc_theme`.
 */
function persistThemeMode(mode: ThemeMode): void {
  const isHttps = window.location.protocol === "https:";
  const secureFlag = isHttps ? "; Secure" : "";
  document.cookie = `${THEME_COOKIE_NAME}=${mode}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax${secureFlag}`;
}

/** Props do AppThemeScope. */
interface AppThemeScopeProps {
  /** Modo resolvido do cookie pelo Server Component `(app)/layout.tsx`. */
  initialMode: ThemeMode;
  /** Subárvore logada que recebe o tema sobreposto. */
  children: ReactNode;
}

/**
 * Provider aninhado de tema da área logada (ver doc do módulo).
 *
 * @param props - modo inicial vindo do cookie + children.
 * @returns Subárvore envolta em contexto de modo + ThemeProvider MUI.
 */
export function AppThemeScope({ initialMode, children }: AppThemeScopeProps) {
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  const toggleMode = useCallback(() => {
    setMode((previous) => {
      const next: ThemeMode = previous === "dark" ? "light" : "dark";
      persistThemeMode(next);
      return next;
    });
  }, []);

  // Mesma pipeline do MainThemeProvider (createTheme + responsiveFontSizes),
  // sem o CacheProvider — o cache Emotion do root cobre esta subárvore.
  const muiTheme = useMemo(
    () =>
      responsiveFontSizes(
        createTheme(
          getMuiThemeByKey(mode === "light" ? "default" : "defaultDark"),
        ),
      ),
    [mode],
  );

  const contextValue = useMemo(
    () => ({ mode, toggleMode }),
    [mode, toggleMode],
  );

  return (
    <AppThemeModeContext.Provider value={contextValue}>
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </AppThemeModeContext.Provider>
  );
}

export default AppThemeScope;
