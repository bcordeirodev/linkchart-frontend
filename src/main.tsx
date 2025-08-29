import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Import styles
import './styles/splash-screen.css';
import './styles/index.css';
import 'leaflet/dist/leaflet.css';

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
