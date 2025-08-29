import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Import styles
import './styles/splash-screen.css';
import './styles/index.css';
import 'leaflet/dist/leaflet.css';

// Configuração simples de captura de erros globais
if (typeof window !== 'undefined') {
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

    console.log('🔧 Sistema de captura de erros configurado - erros aparecerão apenas no console');
}

// Get the root element
const rootElement = document.getElementById('app');
if (!rootElement) {
    throw new Error('Root element not found');
}

// Create React root and render the app
const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
