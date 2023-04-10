import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <CssBaseline />
    <SnackbarProvider maxSnack={4} autoHideDuration={6000}>
      <App />
    </SnackbarProvider>
  </StrictMode>
);
