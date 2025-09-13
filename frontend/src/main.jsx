import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AIStatusProvider } from './context/AIStatusContext';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';
import {LanguageProvider} from "./context/LanguageContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <AIStatusProvider>
              <App />
            </AIStatusProvider>
          </AuthProvider>
        </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
