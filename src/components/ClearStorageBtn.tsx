import { useLogin } from '../helpers';
import { NavigateFunction } from 'react-router-dom';
import { Box } from '@mui/material';
import AppButton from './styled/StyledButtons';

export const ClearStorageBtn = ({
  navigate,
}: {
  navigate: NavigateFunction;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentUser, logIn, logOut] = useLogin();

  return (
    <Box my={2}>
      <AppButton
        className='MainButton-clearStorage'
        size='medium'
        variant='outlined'
        onClick={() => {
          localStorage.clear();
          navigate('/login');
        }}
      >
        clear storage
      </AppButton>
    </Box>
  );
};
