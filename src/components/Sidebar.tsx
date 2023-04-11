import { useOutletContext } from 'react-router-dom';
import { OutletProps } from '../pages/Root';
import { Box, Divider, List, ListItem, Typography } from '@mui/material';

export const Sidebar = () => {
  const { allowedUsers } = useOutletContext<OutletProps>();

  return (
    <>
      <Box mx={2} mt={2}>
        <Typography variant='h5'>Admins</Typography>
        <Divider />
      </Box>

      <List>
        {allowedUsers.map((user) => (
          <ListItem key={user.login}>
            <Typography color={'#1976d2'} variant='h6' component={'span'}>
              {user.login}
            </Typography>
          </ListItem>
        ))}
      </List>
    </>
  );
};
