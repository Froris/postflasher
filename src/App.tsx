import { useState } from 'react';
import { AppBar, Box } from '@mui/material';
import Main from './components/Main';
import TopBar from './components/TopBar';
import { useInitFbSDK } from './api/connectToFB';

function App() {
  // Initializes the Facebook SDK
  const isFbSDKInitialized = useInitFbSDK();

  return (
    <Box className='App'>
      <TopBar />
      <Box display={'flex'}>
        <Box
          sx={{ minWidth: '300px', bgcolor: 'yellowgreen', height: '100vh' }}
        >
          left sidebar
        </Box>
        <Main isFbSDKInitialized={isFbSDKInitialized} />
        <Box sx={{ minWidth: '300px', bgcolor: 'tomato', height: '100vh' }}>
          Right sidebar
        </Box>
      </Box>
    </Box>
  );
}

export default App;
