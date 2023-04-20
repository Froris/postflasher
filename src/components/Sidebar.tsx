import { useNavigate, useOutletContext } from 'react-router-dom';
import { OutletProps } from '../pages/Root';
import { Box, Divider, List, ListItem, Typography } from '@mui/material';
import logo from '../assets/logo.png';
import { useLogin } from '../helpers';
import AppButton from './styled/StyledButtons';
import LogoutIcon from '@mui/icons-material/Logout';

// тут просто выводим список наших админов

export const Sidebar = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentUser, logIn, logOut] = useLogin();
  const navigate = useNavigate();

  function logOutHandler() {
    logOut();
    navigate('/login');
  }
  const { allowedUsers } = useOutletContext<OutletProps>();

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'space-between'}
      py={'40px'}
      sx={{
        boxSizing: 'border-box',
        backgroundColor: '#673D87',
        minWidth: '260px',
        borderRight: '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
      <Box px={'30px'}>
        <Box width={'70px'} height={'70px'} mx={'auto'} mb={'60px'}>
          <img src={logo} alt='logo' />
        </Box>

        <Box>
          <Typography color={'white'} variant='h5'>
            Admins:
          </Typography>
        </Box>

        <List>
          {allowedUsers.map((user) => (
            <ListItem sx={{ margin: '16px 0 !important' }} key={user.login}>
              <Box display={'flex'} flexDirection={'column'} width={'100%'}>
                {user.login !== 'admin@admin' && (
                  <Box display={'flex'} flexWrap={'wrap'} columnGap={1}>
                    <Typography
                      color={'white'}
                      variant='subtitle1'
                      component={'span'}
                    >
                      {user.lastName}
                    </Typography>
                    <Typography
                      color={'white'}
                      variant='subtitle1'
                      component={'span'}
                    >
                      {user.firstName}
                    </Typography>
                    <Typography
                      color={'white'}
                      flex={1}
                      variant='subtitle1'
                      component={'span'}
                    >
                      {user.midName}
                    </Typography>
                  </Box>
                )}

                <Typography
                  color={'#ffd57a'}
                  variant='subtitle1'
                  component={'span'}
                >
                  {user.login}
                </Typography>

                <Divider sx={{ borderBottomColor: '#d6d6d6' }} />
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box width={'50%'} sx={{ margin: '0 auto' }}>
        <AppButton
          className='MainButton'
          size='medium'
          variant='text'
          onClick={logOutHandler}
        >
          <LogoutIcon sx={{ marginRight: '5px' }} />
          Log out
        </AppButton>
      </Box>
    </Box>
  );
};
