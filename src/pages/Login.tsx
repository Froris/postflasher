import { Box } from '@mui/material';
import { LoginForm } from '../components/LoginForm';
import bgi from '../assets/bg.png';

export const Login = () => {
  return (
    <Box
      width='100vw'
      height='100vh'
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      sx={{
        background: `url(${bgi}) 50px 50px np-repeat`,
      }}
    >
      <LoginForm />
    </Box>
  );
};
