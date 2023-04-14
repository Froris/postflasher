import { Box, TextField, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { OutletProps } from '../pages/Root';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useLogin } from '../helpers';

export const LoginForm = () => {
  const { allowedUsers } = useOutletContext<OutletProps>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentUser, logIn] = useLogin();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin(): void {
    // Список юзеров заранее создан. Тут проходит проверка на соответствие тому,
    // что ввёл юзер в форме логина с нашим списком юзеров
    const result = allowedUsers.find((user) => {
      if (user.login === login && user.password === password) {
        return user;
      }
    });

    if (result !== undefined) {
      logIn({ login: result.login });
      navigate('/', { replace: true });
    } else {
      enqueueSnackbar("Неправильне ім'я користувача або пароль.", {
        variant: 'error',
        anchorOrigin: { horizontal: 'center', vertical: 'top' },
      });
    }
  }

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={4}
      width={'400px'}
      height={'400px'}
      p={4}
      sx={{
        backgroundColor: 'white',
        border: '1px solid #1976d2',
        borderRadius: '10px',
      }}
    >
      <Typography>
        PostFlasher
        <span style={{ marginLeft: '10px', color: '#1976d2' }}>Log in</span>
      </Typography>
      <TextField
        type='text'
        fullWidth
        value={login}
        onChange={(e) => setLogin(e.target.value.trim())}
        label='Login'
        variant='standard'
      />

      <TextField
        type='password'
        fullWidth
        value={password}
        label='Password'
        variant='standard'
        onChange={(e) => setPassword(e.target.value.trim())}
      />

      <Box maxWidth={'120px'}>
        <Button
          fullWidth
          variant='contained'
          type='submit'
          onClick={handleLogin}
        >
          log in
        </Button>
      </Box>
    </Box>
  );
};
