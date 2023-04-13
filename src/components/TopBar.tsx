import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useLogin } from '../helpers';
import { useNavigate } from 'react-router-dom';

export default function TopBar() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentUser, logIn, logOut] = useLogin();
  const navigate = useNavigate();

  function logOutHandler() {
    logOut();
    navigate('/login');
  }

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          PostFlasher
        </Typography>
        <Button
          size='medium'
          color='inherit'
          variant='outlined'
          onClick={logOutHandler}
        >
          Log out
        </Button>
        <Button
          size='medium'
          variant='outlined'
          sx={{
            marginLeft: '20px',
          }}
          color='inherit'
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
        >
          clear storage
        </Button>
      </Toolbar>
    </AppBar>
  );
}
