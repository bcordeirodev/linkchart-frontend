'use client';

import { useState, useCallback } from 'react';

interface UseClipboardOptions {
	timeout?: number;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

interface UseClipboardReturn {
	copied: boolean;
	copy: (text: string) => Promise<void>;
	reset: () => void;
}

/**
 * Hook personalizado para operações de clipboard
 * Gerencia estado de copiado e callbacks de sucesso/erro
 */
export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
	const { timeout = 2000, onSuccess, onError } = options;
	const [copied, setCopied] = useState(false);

	const copy = useCallback(
		async (text: string) => {
			try {
				await navigator.clipboard.writeText(text);
				setCopied(true);
				onSuccess?.();

				// Reset estado após timeout
				setTimeout(() => setCopied(false), timeout);
			} catch (error) {
				const err = error instanceof Error ? error : new Error('Erro ao copiar');
				onError?.(err);
				console.error('Erro ao copiar para clipboard:', err);
			}
		},
		[timeout, onSuccess, onError]
	);

	const reset = useCallback(() => {
		setCopied(false);
	}, []);

	return {
		copied,
		copy,
		reset
	};
}

export default useClipboard;
