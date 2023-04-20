import { Box } from '@mui/material';
import { ColorRing } from 'react-loader-spinner';

export const LoadingSpinner = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <Box
      width={'100%'}
      height={'100%'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <ColorRing
        visible={isLoading}
        height='80'
        width='80'
        ariaLabel='blocks-loading'
        wrapperStyle={{}}
        wrapperClass='blocks-wrapper'
        colors={['#03C988', '#B8FFF9', '#85F4FF', '#42C2FF', '#1976d2']}
      />
    </Box>
  );
};
