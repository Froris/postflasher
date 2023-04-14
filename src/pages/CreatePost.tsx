import { Box } from '@mui/material';
import { CreateNews } from '../components/CreateNews';
import { OutletProps } from './Root';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useEffect } from 'react';
import { useLogin } from '../helpers';

export const CreatePost = () => {
  // переменная с состоянием того, подключены ли мы к апи ФБ (именно наш сайт а не юзер)
  const { isFbSDKInitialized } = useOutletContext<OutletProps>();
  const [currentUser] = useLogin();
  const navigate = useNavigate();

  // если юзер не залогинен - перенаправляем на страницу логина
  useEffect(() => {
    if (!currentUser.login) {
      navigate('/login', { replace: true });
    }
  }, [currentUser, navigate]);

  return (
    <Box
      width='100vw'
      height='100vh'
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <CreateNews isFbSDKInitialized={isFbSDKInitialized} />
    </Box>
  );
};
