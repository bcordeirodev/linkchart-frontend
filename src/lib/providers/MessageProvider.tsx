"use client";
/**
 * 📢 MESSAGE PROVIDER — LINK CHART
 * Contexto React para gerenciamento de mensagens/notificações globais,
 * substituindo o antigo `messageSlice` (Redux Toolkit).
 *
 * @description
 * Fila global de toasts com suporte a múltiplas variantes e configurações
 * mobile-first, exposta via `useMessage()`.
 *
 * @mobile-first-improvements
 * - Posicionamento top por padrão (melhor UX em mobile)
 * - Duração aumentada para leitura em mobile (6s vs 4s)
 * - Largura total em dispositivos móveis
 *
 * @since 3.1.0 — migrado de Redux para Context API
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";

import type { ReactElement, ReactNode } from "react";

/**
 * Variantes de mensagem disponíveis
 */
export type MessageVariant = "success" | "error" | "warning" | "info";

/**
 * Posições de ancoragem para o Snackbar
 * Mobile-first: Prioriza posições otimizadas para mobile
 */
export interface AnchorOrigin {
  vertical: "top" | "bottom";
  horizontal: "left" | "center" | "right";
}

/**
 * Opções de configuração da mensagem
 * Mobile-first: Configurações otimizadas para dispositivos móveis
 */
export interface MessageOptions {
  /** Variante da mensagem */
  variant: MessageVariant;
  /** Posição da mensagem */
  anchorOrigin: AnchorOrigin;
  /** Duração antes de esconder automaticamente (null = não esconde) */
  autoHideDuration: number | null;
  /** Conteúdo da mensagem */
  message: ReactElement | ReactNode | string;
  /** Ação personalizada */
  action?: ReactElement;
  /** ID único da mensagem */
  id?: string;
  /** Se deve usar configuração mobile-first */
  isMobile?: boolean;
  /** Largura máxima da mensagem (mobile-first) */
  maxWidth?: string;
  /** Se deve ocupar toda a largura em mobile */
  fullWidth?: boolean;
}

/**
 * Estado do provider
 */
export interface MessageState {
  /** Se a mensagem está visível */
  open: boolean;
  /** Opções da mensagem atual */
  options: MessageOptions;
  /** Fila de mensagens */
  queue: MessageOptions[];
}

/**
 * Estado inicial
 * Mobile-first: Configurações padrão otimizadas para mobile
 */
const initialState: MessageState = {
  open: false,
  options: {
    variant: "info",
    anchorOrigin: {
      vertical: "top", // Mobile-first: top é melhor para acessibilidade em mobile
      horizontal: "center",
    },
    autoHideDuration: 5000, // Mobile-first: mais tempo para leitura em mobile
    message: "",
    isMobile: false,
    maxWidth: "100%", // Mobile-first: largura total por padrão
    fullWidth: true, // Mobile-first: ocupar toda largura em mobile
  },
  queue: [],
};

type MessageAction =
  | { type: "SHOW_MESSAGE"; payload: Partial<MessageOptions> }
  | { type: "HIDE_MESSAGE" };

function messageReducer(
  state: MessageState,
  action: MessageAction,
): MessageState {
  switch (action.type) {
    case "SHOW_MESSAGE": {
      const messageOptions: MessageOptions = {
        ...initialState.options,
        ...action.payload,
        id: action.payload.id || Date.now().toString(),
      };

      // Mobile-first: Ajustar configurações baseado no dispositivo
      if (messageOptions.isMobile) {
        messageOptions.anchorOrigin = {
          vertical: "top",
          horizontal: "center",
        };
        messageOptions.fullWidth = true;
        messageOptions.maxWidth = "100%";
        messageOptions.autoHideDuration = 6000; // Mais tempo em mobile
      }

      // Se já há uma mensagem sendo exibida, adiciona à fila
      if (state.open) {
        return { ...state, queue: [...state.queue, messageOptions] };
      }

      return { ...state, open: true, options: messageOptions };
    }

    case "HIDE_MESSAGE": {
      // Se há mensagens na fila, mostra a próxima
      const [nextMessage, ...rest] = state.queue;

      if (nextMessage) {
        return { ...state, open: true, options: nextMessage, queue: rest };
      }

      return { ...state, open: false };
    }

    default:
      return state;
  }
}

interface MessageContextValue extends MessageState {
  /** Mostra uma mensagem; mescla com os defaults e aplica ajustes mobile-first. */
  showMessage: (payload: Partial<MessageOptions>) => void;
  /** Esconde a mensagem atual e avança a fila, se houver. */
  hideMessage: () => void;
}

const MessageContext = createContext<MessageContextValue | null>(null);

/**
 * Global toast/message provider — substitui o antigo `messageSlice` (Redux).
 *
 * Mantém a fila de mensagens em `useReducer` e expõe `showMessage`/`hideMessage`
 * via contexto. Deve envolver a árvore em algum ponto acima de `<Message />`
 * (montado em `Providers.tsx`, dentro de `MainThemeProvider`).
 */
export function MessageProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(messageReducer, initialState);

  const showMessage = useCallback((payload: Partial<MessageOptions>) => {
    dispatch({ type: "SHOW_MESSAGE", payload });
  }, []);

  const hideMessage = useCallback(() => {
    dispatch({ type: "HIDE_MESSAGE" });
  }, []);

  const value = useMemo<MessageContextValue>(
    () => ({ ...state, showMessage, hideMessage }),
    [state, showMessage, hideMessage],
  );

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
}

/**
 * Hook de acesso ao contexto de mensagens globais. Lança erro se usado fora
 * de `<MessageProvider>`.
 */
export function useMessage(): MessageContextValue {
  const context = useContext(MessageContext);

  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }

  return context;
}
