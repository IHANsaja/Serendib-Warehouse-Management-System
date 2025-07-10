import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AIStatusProvider } from './context/AIStatusContext';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AIStatusProvider>
          <App />
        </AIStatusProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
