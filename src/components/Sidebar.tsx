import { useOutletContext } from 'react-router-dom';
import { OutletProps } from '../pages/Root';
import { Box, Divider, List, ListItem, Typography } from '@mui/material';

export const Sidebar = () => {
  const { allowedUsers } = useOutletContext<OutletProps>();

  return (
    <>
      <Box mx={2} mt={2}>
        <Typography variant='h5'>Admins</Typography>
      </Box>

      <List>
        {allowedUsers.map((user) => (
          <ListItem key={user.login}>
            <Box display={'flex'} flexDirection={'column'} width={'100%'}>
              {user.login !== 'admin@admin' && (
                <Box display={'flex'} flexWrap={'wrap'}>
                  <Typography variant='subtitle1' component={'span'}>
                    {user.lastName}
                  </Typography>
                  <Typography mx={1} variant='subtitle1' component={'span'}>
                    {user.firstName}
                  </Typography>
                  <Typography flex={1} variant='subtitle1' component={'span'}>
                    {user.midName}
                  </Typography>
                </Box>
              )}

              <Typography
                color={'#1976d2'}
                variant='subtitle1'
                component={'span'}
              >
                {user.login}
              </Typography>

              <Divider />
            </Box>
          </ListItem>
        ))}
      </List>
    </>
  );
};
