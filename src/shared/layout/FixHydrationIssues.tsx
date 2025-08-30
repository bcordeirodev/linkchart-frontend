import { useEffect } from 'react';

/**
 * Componente para corrigir problemas de hidratação comuns
 * Especialmente útil para resolver conflitos entre SSR e CSR
 */
export default function FixHydrationIssues() {
	useEffect(() => {
		// Fix para problemas de hidratação do Material-UI
		const fixMuiHydration = () => {
			// Remove elementos p aninhados que podem causar conflitos
			const problematicElements = document.querySelectorAll(
				'.MuiListItemText-root p p, .MuiTypography-root p p, p p'
			);

			problematicElements.forEach((element) => {
				// Converte p aninhados em div
				if (element.tagName === 'P' && element.parentElement?.tagName === 'P') {
					const div = document.createElement('div');
					div.innerHTML = element.innerHTML;
					div.className = element.className;
					element.parentElement?.replaceChild(div, element);
				}
			});
		};

		// Executa a correção após o carregamento
		fixMuiHydration();

		// Observer para elementos adicionados dinamicamente
		const observer = new MutationObserver(() => {
			fixMuiHydration();
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	return null;
}
