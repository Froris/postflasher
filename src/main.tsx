import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { CssBaseline } from '@mui/material';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <CssBaseline />
    <App />
  </StrictMode>
);
