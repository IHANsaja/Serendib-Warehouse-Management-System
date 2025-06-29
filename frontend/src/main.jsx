import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AIStatusProvider } from './context/AIStatusContext'; // <-- Add this import
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AIStatusProvider>
        <App />
      </AIStatusProvider>
    </BrowserRouter>
  </React.StrictMode>
);
