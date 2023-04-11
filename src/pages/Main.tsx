import { Box, Button } from '@mui/material';
import Table from '../components/Table';
import TopBar from '../components/TopBar';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../helpers';
import { useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';

function Main() {
  const [currentUser] = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser.login) {
      navigate('/login', { replace: true });
    }

    console.log('current user from main', currentUser);
  }, [currentUser.login, navigate]);

  console.log('current user from main 2', currentUser);

  return (
    <Box className='App' display={'flex'} flexDirection={'column'}>
      <TopBar />
      <Box display={'flex'} flexGrow={1}>
        <Box
          sx={{
            minWidth: '300px',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          }}
        >
          <Sidebar />
        </Box>
        <Box m={2} width={'100%'}>
          <Box my={2}>
            <Button variant='contained' onClick={() => navigate('/create')}>
              CREATE POST
            </Button>
          </Box>

          <Table />
        </Box>
      </Box>
    </Box>
  );
}

export default Main;
