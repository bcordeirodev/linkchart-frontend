'use client';
import { useEffect, useRef, useState } from 'react';

export type UrlSafetyStatus = 'idle' | 'checking' | 'safe' | 'unsafe' | 'error';

export interface UrlSafetyCheckResult {
	status: UrlSafetyStatus;
	threats: string[];
}

export function useUrlSafetyCheck(url: string, debounceMs = 700): UrlSafetyCheckResult {
	const [status, setStatus] = useState<UrlSafetyStatus>('idle');
	const [threats, setThreats] = useState<string[]>([]);
	const abortRef = useRef<AbortController | null>(null);

	useEffect(() => {
		if (!url || !/^https?:\/\/.+/.test(url)) {
			setStatus('idle');
			setThreats([]);
			return;
		}

		const timer = setTimeout(async () => {
			abortRef.current?.abort();
			const controller = new AbortController();
			abortRef.current = controller;

			setStatus('checking');

			try {
				const response = await fetch('/api/check-url', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ url }),
					signal: controller.signal,
				});

				if (!response.ok) {
					setStatus('error');
					return;
				}

				const data = await response.json();
				setThreats(data.threats ?? []);
				setStatus(data.isSafe ? 'safe' : 'unsafe');
			} catch (e) {
				if ((e as Error).name !== 'AbortError') {
					setStatus('error');
				}
			}
		}, debounceMs);

		return () => {
			clearTimeout(timer);
			abortRef.current?.abort();
		};
	}, [url, debounceMs]);

	return { status, threats };
}
