import { NavigateFunction } from 'react-router-dom';
import { Box } from '@mui/material';
import AppButton from './styled/StyledButtons';

export const ClearStorageBtn = ({
  navigate,
}: {
  navigate: NavigateFunction;
}) => {
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
