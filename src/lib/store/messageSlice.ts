/**
 * 📢 MESSAGE SLICE - LINK CHART
 * Sistema de mensagens global melhorado com Mobile-First Design
 *
 * @description
 * Slice Redux para gerenciamento de mensagens/notificações globais
 * com suporte a múltiplas variantes e configurações avançadas.
 * Otimizado para dispositivos móveis com abordagem mobile-first.
 *
 * @features
 * - ✅ Múltiplas variantes (success, error, warning, info)
 * - ✅ Posicionamento configurável
 * - ✅ Auto-hide configurável
 * - ✅ Ações personalizadas
 * - ✅ TypeScript completo
 * - ✅ Integração com Redux Toolkit
 * - 🆕 Mobile-first design otimizado
 * - 🆕 Detecção automática de dispositivo
 * - 🆕 Configurações responsivas
 * - 🆕 Helpers específicos para mobile
 *
 * @mobile-first-improvements
 * - Posicionamento top por padrão (melhor UX em mobile)
 * - Duração aumentada para leitura em mobile (6s vs 4s)
 * - Largura total em dispositivos móveis
 * - Helpers específicos para mobile (showMobileMessage, etc.)
 * - Detecção automática de dispositivo (showResponsiveMessage)
 *
 * @since 2.0.0
 * @updated 2.1.0 - Mobile-first improvements
 */

import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { ReactElement, ReactNode } from 'react';
import rootReducer from './rootReducer';

/**
 * Variantes de mensagem disponíveis
 */
export type MessageVariant = 'success' | 'error' | 'warning' | 'info';

/**
 * Posições de ancoragem para o Snackbar
 * Mobile-first: Prioriza posições otimizadas para mobile
 */
export interface AnchorOrigin {
	vertical: 'top' | 'bottom';
	horizontal: 'left' | 'center' | 'right';
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
 * Estado inicial do slice
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
		variant: 'info',
		anchorOrigin: {
			vertical: 'top', // Mobile-first: top é melhor para acessibilidade em mobile
			horizontal: 'center'
		},
		autoHideDuration: 5000, // Mobile-first: mais tempo para leitura em mobile
		message: '',
		isMobile: false,
		maxWidth: '100%', // Mobile-first: largura total por padrão
		fullWidth: true // Mobile-first: ocupar toda largura em mobile
	},
	queue: []
};

/**
 * Slice de mensagens
 */
export const messageSlice = createSlice({
	name: 'message',
	initialState,
	reducers: {
		/**
		 * Mostra uma mensagem
		 * Mobile-first: Aplica configurações responsivas automaticamente
		 */
		showMessage(state, action: PayloadAction<Partial<MessageOptions>>) {
			const messageOptions: MessageOptions = {
				...initialState.options,
				...action.payload,
				id: action.payload.id || Date.now().toString()
			};

			// Mobile-first: Ajustar configurações baseado no dispositivo
			if (messageOptions.isMobile) {
				messageOptions.anchorOrigin = {
					vertical: 'top',
					horizontal: 'center'
				};
				messageOptions.fullWidth = true;
				messageOptions.maxWidth = '100%';
				messageOptions.autoHideDuration = 6000; // Mais tempo em mobile
			}

			// Se já há uma mensagem sendo exibida, adiciona à fila
			if (state.open) {
				state.queue.push(messageOptions);
			} else {
				state.open = true;
				state.options = messageOptions;
			}
		},

		/**
		 * Esconde a mensagem atual
		 */
		hideMessage(state) {
			state.open = false;

			// Se há mensagens na fila, mostra a próxima
			if (state.queue.length > 0) {
				const nextMessage = state.queue.shift();

				if (nextMessage) {
					state.open = true;
					state.options = nextMessage;
				}
			}
		},

		/**
		 * Limpa todas as mensagens
		 */
		clearMessages(state) {
			state.open = false;
			state.queue = [];
		},

		/**
		 * Remove uma mensagem específica da fila
		 */
		removeMessage(state, action: PayloadAction<string>) {
			const messageId = action.payload;
			state.queue = state.queue.filter((msg) => msg.id !== messageId);

			// Se a mensagem atual tem o ID, esconde
			if (state.options.id === messageId) {
				state.open = false;

				// Mostra próxima da fila se houver
				if (state.queue.length > 0) {
					const nextMessage = state.queue.shift();

					if (nextMessage) {
						state.open = true;
						state.options = nextMessage;
					}
				}
			}
		}
	},
	selectors: {
		selectMessageState: (message) => message.open,
		selectMessageOptions: (message) => message.options,
		selectMessageQueue: (message) => message.queue,
		selectMessageCount: (message) => message.queue.length + (message.open ? 1 : 0)
	}
});

/**
 * Lazy load injection
 */
rootReducer.inject(messageSlice);
const injectedSlice = messageSlice.injectInto(rootReducer);

declare module './rootReducer' {
	export interface LazyLoadedSlices extends WithSlice<typeof messageSlice> {}
}

// Export actions
export const { showMessage, hideMessage, clearMessages, removeMessage } = messageSlice.actions;

// Export selectors
export const { selectMessageState, selectMessageOptions, selectMessageQueue, selectMessageCount } =
	injectedSlice.selectors;

// Helper functions for common message types
export const showSuccessMessage = (message: string | ReactNode) => showMessage({ variant: 'success', message });

export const showErrorMessage = (message: string | ReactNode) => showMessage({ variant: 'error', message });

export const showWarningMessage = (message: string | ReactNode) => showMessage({ variant: 'warning', message });

export const showInfoMessage = (message: string | ReactNode) => showMessage({ variant: 'info', message });

// Mobile-first helper functions
export const showMobileMessage = (message: string | ReactNode, variant: MessageVariant = 'info') =>
	showMessage({
		variant,
		message,
		isMobile: true,
		anchorOrigin: { vertical: 'top', horizontal: 'center' },
		fullWidth: true,
		maxWidth: '100%',
		autoHideDuration: 6000
	});

export const showMobileSuccessMessage = (message: string | ReactNode) => showMobileMessage(message, 'success');

export const showMobileErrorMessage = (message: string | ReactNode) => showMobileMessage(message, 'error');

export const showMobileWarningMessage = (message: string | ReactNode) => showMobileMessage(message, 'warning');

export const showMobileInfoMessage = (message: string | ReactNode) => showMobileMessage(message, 'info');

// Responsive helper that detects device type
export const showResponsiveMessage = (
	message: string | ReactNode,
	variant: MessageVariant = 'info',
	isMobile: boolean = window.innerWidth <= 768
) =>
	showMessage({
		variant,
		message,
		isMobile,
		anchorOrigin: isMobile
			? { vertical: 'top', horizontal: 'center' }
			: { vertical: 'bottom', horizontal: 'center' },
		fullWidth: isMobile,
		maxWidth: isMobile ? '100%' : '600px',
		autoHideDuration: isMobile ? 6000 : 4000
	});

// Compatibility exports
export const fuseMessageSlice = messageSlice;
export const selectFuseMessageState = selectMessageState;
export const selectFuseMessageOptions = selectMessageOptions;

export type MessageSliceType = typeof messageSlice;

export default messageSlice.reducer;
