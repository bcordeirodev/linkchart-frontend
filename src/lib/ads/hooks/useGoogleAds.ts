import { useEffect, useRef } from 'react';

import { GOOGLE_ADS_CONFIG } from '../config/adsConfig';

declare global {
	interface Window {
		adsbygoogle: any[];
	}
}

/**
 * 📢 HOOK PARA GOOGLE ADS
 *
 * Gerencia a inicialização e carregamento dos anúncios do Google AdSense
 */
export function useGoogleAds() {
	const adRef = useRef<HTMLModElement>(null);
	const isInitialized = useRef(false);

	useEffect(() => {
		// Verificar se o script do AdSense foi carregado
		if (typeof window !== 'undefined' && window.adsbygoogle) {
			try {
				// Inicializar apenas uma vez por componente
				if (!isInitialized.current && adRef.current) {
					// Push do anúncio para a fila do AdSense
					(window.adsbygoogle = window.adsbygoogle || []).push({});
					isInitialized.current = true;
				}
			} catch (error) {
				console.warn('Erro ao inicializar Google Ads:', error);
			}
		}
	}, []);

	return { adRef };
}

/**
 * 📊 CONFIGURAÇÕES DE SLOTS DE ANÚNCIOS
 *
 * Diferentes configurações para diferentes tipos de anúncios
 */
export const AD_SLOTS = {
	// Banner horizontal - 728x90
	banner: {
		slot: GOOGLE_ADS_CONFIG.slots.banner,
		format: 'auto',
		responsive: true,
		style: { display: 'block', width: '100%', height: '90px' }
	},

	// Rectangle - 300x250
	rectangle: {
		slot: GOOGLE_ADS_CONFIG.slots.rectangle,
		format: 'auto',
		responsive: true,
		style: { display: 'block', width: '300px', height: '250px', margin: '0 auto' }
	},

	// Leaderboard - 728x90
	leaderboard: {
		slot: GOOGLE_ADS_CONFIG.slots.leaderboard,
		format: 'auto',
		responsive: true,
		style: { display: 'block', width: '100%', height: '90px' }
	},

	// Sidebar - 160x600
	sidebar: {
		slot: GOOGLE_ADS_CONFIG.slots.sidebar,
		format: 'auto',
		responsive: true,
		style: { display: 'block', width: '160px', height: '600px' }
	}
} as const;

export type AdSlotType = keyof typeof AD_SLOTS;
