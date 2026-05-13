import React from 'react';
import ReactDOM from 'react-dom/client';

// 🔥 IMPORTANT: Load i18n BEFORE App
import "./i18n";

import './styles/index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// ❌ Disable service worker to avoid caching issues
serviceWorkerRegistration.unregister();