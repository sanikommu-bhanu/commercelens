import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { seedIfNeeded } from './lib/seedData';
import { useAuthStore } from './store/auth';
import { useUiStore } from './store/ui';

seedIfNeeded();
useAuthStore.getState().initAuth();
useUiStore.getState().initTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="app-shell shadow-2xl overflow-x-hidden">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </div>
  </React.StrictMode>
);
