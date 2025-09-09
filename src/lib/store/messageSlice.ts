/**
 * 📢 MESSAGE SLICE - LINK CHART
 * Sistema de mensagens global melhorado
 *
 * @description
 * Slice Redux para gerenciamento de mensagens/notificações globais
 * com suporte a múltiplas variantes e configurações avançadas.
 *
 * @features
 * - ✅ Múltiplas variantes (success, error, warning, info)
 * - ✅ Posicionamento configurável
 * - ✅ Auto-hide configurável
 * - ✅ Ações personalizadas
 * - ✅ TypeScript completo
 * - ✅ Integração com Redux Toolkit
 *
 * @since 2.0.0
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
 */
export interface AnchorOrigin {
	vertical: 'top' | 'bottom';
	horizontal: 'left' | 'center' | 'right';
}

/**
 * Opções de configuração da mensagem
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
 */
const initialState: MessageState = {
	open: false,
	options: {
		variant: 'info',
		anchorOrigin: {
			vertical: 'bottom',
			horizontal: 'center'
		},
		autoHideDuration: 4000,
		message: ''
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
		 */
		showMessage(state, action: PayloadAction<Partial<MessageOptions>>) {
			const messageOptions: MessageOptions = {
				...initialState.options,
				...action.payload,
				id: action.payload.id || Date.now().toString()
			};

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

// Compatibility exports
export const fuseMessageSlice = messageSlice;
export const selectFuseMessageState = selectMessageState;
export const selectFuseMessageOptions = selectMessageOptions;

export type MessageSliceType = typeof messageSlice;

export default messageSlice.reducer;
