import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../helpers';
import { useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TableContainer } from '../components/table/TableContainer';

function Main() {
  const [currentUser] = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser.login) {
      navigate('/login', { replace: true });
    }
  }, [currentUser.login, navigate]);

  return (
    <Box className='App' display={'flex'} width={'100%'}>
      <Sidebar />
      <TableContainer navigate={navigate} />
    </Box>
  );
}

export default Main;
