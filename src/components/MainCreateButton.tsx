import { Box, Typography } from '@mui/material';
import { NavigateFunction } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import AppButton from './styled/StyledButtons';

// Меняем дизайн кнопки зависимо от того, есть ли у нас уже посты

export const MainCreateButton = ({
  navigate,
  postsLength,
}: {
  postsLength: number;
  navigate: NavigateFunction;
}) => {
  return (
    <Box
      my={2}
      columnGap={1}
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
    >
      <Typography
        variant='h4'
        component={'span'}
      >{`Пости (${postsLength})`}</Typography>
      <AppButton
        size='small'
        className='MainButton-add'
        variant='contained'
        onClick={() => navigate('/create')}
      >
        {postsLength > 0 ? <AddIcon fontSize='medium' /> : 'СТВОРИТИ ПОСТ'}
      </AppButton>
    </Box>
  );
};
