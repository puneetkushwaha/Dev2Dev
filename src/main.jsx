import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'
import { loader } from '@monaco-editor/react';

// Configure Monaco Editor to load from a specific CDN version to avoid CORS/loading issues
loader.config({
  paths: {
    vs: 'https://unpkg.com/monaco-editor@0.44.0/min/vs'
  },
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "PROVIDE_CLIENT_ID"}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
