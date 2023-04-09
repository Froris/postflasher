import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { CreateNews } from './CreateNews';

// TODO: вынести в контекст
interface MainProps {
  isFbSDKInitialized: boolean;
}
export default function Main({ isFbSDKInitialized }: MainProps) {
  return (
    <Container disableGutters>
      <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }}>
        <CreateNews isFbSDKInitialized={isFbSDKInitialized} />
      </Box>
    </Container>
  );
}
