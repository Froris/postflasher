import {
  Alert,
  Box,
  Button,
  IconButton,
  Popover,
  Typography,
} from '@mui/material';
import { memo, useState } from 'react';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

type FBPopUpProps = {
  isUserConnected: boolean;
  onLogIn: () => void;
  onLogOut: () => void;
};

export const FBConnectPopUp = memo(function FBConnectPopUp({
  isUserConnected,
  onLogIn,
  onLogOut,
}: FBPopUpProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  console.log('Pop re-rendered!');

  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Box maxWidth={'400px'}>
          {isUserConnected ? (
            <Alert variant='standard' severity='success'>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'flex-end'}
                gap={1}
              >
                <Typography>Підключено до Facebook API</Typography>
                <Button
                  size='small'
                  variant='contained'
                  color='error'
                  type='submit'
                  onClick={onLogOut}
                >
                  disconnect
                </Button>
              </Box>
            </Alert>
          ) : (
            <Alert variant='standard' severity='warning'>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'flex-end'}
                gap={1}
              >
                <Typography>
                  Ви не підключені до Facebook.
                  <br /> Будь ласка, увійдіть в свій обліковий запис
                  адміністратора на Facebook натиснувши кнопку
                  &quot;connect&quot;.
                </Typography>
                <Button
                  size='small'
                  variant='contained'
                  color='success'
                  type='submit'
                  onClick={onLogIn}
                >
                  connect
                </Button>
              </Box>
            </Alert>
          )}
        </Box>
      </Popover>
      {isUserConnected ? (
        <IconButton
          onMouseOver={(e) => setAnchorEl(e.currentTarget)}
          sx={{ color: '#8ecc91' }}
        >
          <CheckCircleIcon fontSize='large' />
        </IconButton>
      ) : (
        <IconButton
          onMouseOver={(e) => setAnchorEl(e.currentTarget)}
          sx={{ color: '#ffd57a' }}
        >
          <ReportProblemIcon fontSize='large' />
        </IconButton>
      )}
    </>
  );
});
