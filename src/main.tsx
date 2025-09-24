import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

// Import styles - ORDEM CORRETA para evitar conflitos
import './styles/index.css';
import './styles/app-base.css';
import './styles/animations.css';
import './styles/splash-screen.css';
import 'leaflet/dist/leaflet.css';

// Captura erros não tratados
window.addEventListener('error', (event) => {
	console.group('🚨 Erro Global Não Tratado');
	console.error('Erro:', event.error || event.message);
	console.error('Arquivo:', event.filename);
	console.error('Linha:', event.lineno);
	console.error('Coluna:', event.colno);
	console.error('URL:', window.location.href);
	console.error('Timestamp:', new Date().toISOString());
	console.groupEnd();
});

// Captura rejeições de promessas não tratadas
window.addEventListener('unhandledrejection', (event) => {
	console.group('🚨 Promessa Rejeitada Não Tratada');
	console.error('Motivo:', event.reason);
	console.error('URL:', window.location.href);
	console.error('Timestamp:', new Date().toISOString());
	console.groupEnd();
});

// Get the root element
const rootElement = document.getElementById('app');

if (!rootElement) {
	throw new Error('Root element not found');
}

// Create React root and render the app
const root = ReactDOM.createRoot(rootElement);

root.render(
	<React.StrictMode>
		<BrowserRouter
			future={{
				v7_startTransition: true,
				v7_relativeSplatPath: true
			}}
		>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);
