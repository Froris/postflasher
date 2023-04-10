import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { publishToFacebook } from '../api/facebookApi';
import { FbApiPageAccessResponse, StatusResponse } from '../api/types';
import { ColorRing } from 'react-loader-spinner';
import { createNews } from '../api/telegrafApi';
import { useSnackbar } from 'notistack';

interface INotification {
  message: string;
  variant: 'error' | 'warning' | 'success';
}

interface CreateNewsProps {
  isFbSDKInitialized: boolean;
}

const pageId = import.meta.env.VITE_FB_PAGE_ID as string;

// TODO: вынести логику логина/логаута в отдельный компонент с кнопкой
// TODO: вынести функционал авторизации в отдельный класс в facebookApi
export const CreateNews = ({ isFbSDKInitialized }: CreateNewsProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const [isUserConnected, setIsUserConnected] = useState(true);
  const [accessTokens, setAccessTokens] = useState<{
    userToken: string | undefined;
    pageToken: string | undefined;
  }>({
    userToken: undefined,
    pageToken: undefined,
  });

  const [userId, setUserId] = useState<undefined | string>(undefined);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [isFbChecked, setIsFbChecked] = useState(false);
  const [isTgChecked, setIsTgChecked] = useState(false);

  const [isPublishing, setIsPublishing] = useState(false);

  console.log('re-rendered');

  function createNotification({ message, variant }: INotification) {
    enqueueSnackbar(message, {
      variant,
      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    });
  }

  // Logs in a Facebook user
  const logInToFB = useCallback(() => {
    window.FB.login(
      (response: StatusResponse) => {
        if (response && response.authResponse) {
          const accessTokens = {
            userToken: response.authResponse.accessToken,
            pageToken: undefined,
          };

          setAccessTokens(accessTokens);
        }
      },
      {
        // Test config
        config_id: '125981323709492',
        // Prod config
        //config_id: '242965031558610',
      }
    );
  }, []);

  // Logs out the current Facebook user
  const logOutOfFB = useCallback(() => {
    window.FB.logout(() => {
      const tokens = {
        userToken: undefined,
        pageToken: undefined,
      };
      setAccessTokens(tokens);
      setIsUserConnected(false);
    });
  }, []);

  function submitHandler(): void {
    // Проверяем, что была введена ссылка на картинку
    if (!imageUrl) {
      createNotification({
        message: 'Please enter an image URL',
        variant: 'warning',
      });
      return;
    }

    async function startPublish() {
      setIsPublishing(true);

      if (isTgChecked) {
        createNews(title, text, imageUrl)
          .then((result) => {
            createNotification({ message: result, variant: 'success' });
          })
          .catch((error: string) => {
            createNotification({ message: error, variant: 'error' });
          });
      }

      if (isFbChecked && accessTokens.userToken && accessTokens.pageToken) {
        await publishToFacebook(
          pageId,
          accessTokens.pageToken,
          imageUrl,
          title,
          text
        )
          .then((response) => {
            createNotification({ message: response, variant: 'success' });
          })
          .catch((err) => {
            console.error('Error! Failed to post to Facebook. ', err);

            createNotification({
              message: 'Error! Failed to post to Facebook.',
              variant: 'success',
            });
          });
      } else {
        createNotification({
          message: 'You are not connected to Facbook!',
          variant: 'warning',
        });
      }
    }

    startPublish()
      .then(() => {
        setIsFbChecked(false);
        setIsTgChecked(false);
        setTitle('');
        setText('');
        setImageUrl('');
        setIsPublishing(false);
      })
      .catch((err: string) => console.warn('Error from startPublish: ', err));
  }

  // Checks if the user is logged in to Facebook
  useEffect(() => {
    console.warn(
      'Warning! FB getLoginStatus re-render! Risk of being blocked!'
    );
    if (isFbSDKInitialized) {
      window.FB.getLoginStatus((response: StatusResponse) => {
        if (response.status === 'connected') {
          setUserId(response.authResponse.userID);

          setAccessTokens((prev) => ({
            ...prev,
            userToken: response.authResponse.accessToken,
          }));
        } else {
          setIsUserConnected(false);
        }
        console.log(response);
      });
    }
  }, [isFbSDKInitialized]);

  // Fetches an access token for the page
  useEffect(() => {
    console.warn('Warning! FB getPageToken re-render! Risk of being blocked!');
    if (userId && accessTokens.userToken) {
      window.FB.api(
        `/${userId}/accounts?access_token=${accessTokens.userToken}`,
        (response: FbApiPageAccessResponse) => {
          if (response && response.data) {
            setAccessTokens((prev) => ({
              ...prev,
              pageToken: response.data[0].access_token,
            }));
          }
        }
      );
    }
  }, [accessTokens.userToken, userId]);

  console.log('tokens: ', accessTokens);

  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      width={'600px'}
      height={'600px'}
      p={3}
      sx={{
        backgroundColor: 'white',
        border: '1px solid black',
        borderRadius: '10px',
      }}
    >
      {isPublishing ? (
        <ColorRing
          visible={isPublishing}
          height='80'
          width='80'
          ariaLabel='blocks-loading'
          wrapperStyle={{}}
          wrapperClass='blocks-wrapper'
          colors={['#03C988', '#B8FFF9', '#85F4FF', '#42C2FF', '#1976d2']}
        />
      ) : (
        <Box display={'flex'} flexDirection={'column'} gap={2} width={'100%'}>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value.toUpperCase())}
            id='standard-basic'
            label='Title'
            variant='standard'
          />

          <TextareaAutosize
            aria-label='minimum height'
            minRows={6}
            placeholder='News text...'
            onChange={(e) => setText(e.target.value)}
            style={{ width: '100%' }}
          />

          <TextField
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            id='standard-basic'
            label='Image URL'
            variant='standard'
          />

          <Box my={2}>
            <Typography variant='subtitle1'>
              Where should we publish?
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                label='Telegram'
                checked={isTgChecked}
                onChange={(e: SyntheticEvent, checked: boolean) => {
                  setIsTgChecked(checked);
                }}
              />
              <Box>
                <FormControlLabel
                  control={<Checkbox />}
                  label='Facebook'
                  checked={isFbChecked}
                  onChange={(e: SyntheticEvent, checked: boolean) => {
                    setIsFbChecked(checked);
                  }}
                  disabled={!accessTokens.pageToken || !isUserConnected}
                />
                {!isUserConnected && !accessTokens.pageToken ? (
                  <Typography variant='subtitle2'>
                    You are not connected to Facebook. Please log in to your
                    Facebook admin account.
                  </Typography>
                ) : (
                  <Typography variant='subtitle2'>Connected</Typography>
                )}
              </Box>
            </FormGroup>
          </Box>
          <Button type='submit' onClick={logInToFB}>
            log in
          </Button>
          <Button type='submit' onClick={logOutOfFB}>
            log out
          </Button>
          <Button type='submit' onClick={submitHandler}>
            CREATE
          </Button>
        </Box>
      )}
    </Box>
  );
};
