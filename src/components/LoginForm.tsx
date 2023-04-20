import { Box } from '@mui/material';
import { useState } from 'react';
import { OutletProps } from '../pages/Root';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useLogin } from '../helpers';
import logo from '../assets/logo.png';
import AppTextField from './styled/StyledTextField';
import AppButton from './styled/StyledButtons';

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
      gap={2}
      width={'437px'}
      height={'427px'}
      p={4}
      sx={{
        boxSizing: 'border-box',
        backgroundColor: '#9649FC',
        border: '2px solid #673D87',
        borderRadius: '30px',
      }}
    >
      <Box width={'80px'} height={'80px'} mx={'auto'} mb={'40px'}>
        <img src={logo} alt='logo' />
      </Box>
      <Box
        width={'100%'}
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        rowGap={2}
      >
        <AppTextField
          type='text'
          fullWidth
          value={login}
          onChange={(e) => setLogin(e.target.value.trim())}
          label='Login'
          variant='standard'
        />

        <AppTextField
          type='password'
          fullWidth
          value={password}
          label='Password'
          variant='standard'
          onChange={(e) => setPassword(e.target.value.trim())}
        />

        <Box mb={'80px'} mt={'30px'} maxWidth={'120px'}>
          <AppButton
            className='FormButton-logIn'
            fullWidth
            variant='contained'
            type='submit'
            onClick={handleLogin}
          >
            log in
          </AppButton>
        </Box>
      </Box>
    </Box>
  );
};
