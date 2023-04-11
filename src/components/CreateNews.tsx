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
import { createTimeStamp, useLocalStorage, useLogin } from '../helpers';
import { useNavigate } from 'react-router-dom';

interface INotification {
  message: string;
  variant: 'error' | 'warning' | 'success';
}

interface CreateNewsProps {
  isFbSDKInitialized: boolean;
}

const groupId = import.meta.env.VITE_FB_GROUP_ID as string;

// TODO: вынести логику логина/логаута в отдельный компонент с кнопкой
// TODO: вынести функционал авторизации в отдельный класс в facebookApi
export const CreateNews = ({ isFbSDKInitialized }: CreateNewsProps) => {
  const [currentUser] = useLogin();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [posts, addPost] = useLocalStorage();

  const [isUserConnected, setIsUserConnected] = useState(false);
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

  function createNotification({ message, variant }: INotification) {
    enqueueSnackbar(message, {
      variant,
      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    });
  }

  function resetForm() {
    setIsFbChecked(false);
    setIsTgChecked(false);
    setTitle('');
    setText('');
    setImageUrl('');
    setIsPublishing(false);
  }

  async function saveToLocalStorage(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        addPost({
          id: posts.length,
          author: currentUser.login,
          text,
          title,
          imageUrl,
          publishedTo: {
            isPublishedToTG: isTgChecked,
            isPublishedToFB: isFbChecked,
          },
          time: createTimeStamp(),
        });
        resolve('Successfully saved to DB!');
      } catch (error) {
        reject('Error! Failed to save to DB!');
      }
    });
  }

  // Logs in a Facebook user
  const logInToFB = useCallback(() => {
    window.FB.login((response: StatusResponse) => {
      console.log('Log in response: ', response);
      if (response && response.authResponse) {
        const accessTokens = {
          userToken: response.authResponse.accessToken,
          pageToken: undefined,
        };

        setAccessTokens(accessTokens);
        setIsUserConnected(true);
      }
    });
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

    if (!confirm('Publish this post?')) {
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

      if (isFbChecked && accessTokens.userToken) {
        await publishToFacebook(
          groupId,
          accessTokens.userToken,
          imageUrl,
          title,
          text
        )
          .then((response) => {
            createNotification({ message: response, variant: 'success' });
          })
          .catch((err: string) => {
            console.error('Error! Failed to post to Facebook. ', err);

            createNotification({
              message: err,
              variant: 'error',
            });
          });
      }
    }

    startPublish()
      .then(() => saveToLocalStorage())
      .then((result) => {
        createNotification({ message: result, variant: 'success' });
      })
      .finally(() => resetForm())
      .catch((err) => console.error(err));
  }

  // Checks if the user is logged in to Facebook
  useEffect(() => {
    console.warn(
      'Warning! FB getLoginStatus re-render! Risk of being blocked!'
    );
    if (isFbSDKInitialized) {
      window.FB.getLoginStatus((response: StatusResponse) => {
        console.log('GetLoginStatusresponse: ', response);
        if (response.status === 'connected') {
          setUserId(response.authResponse.userID);

          setAccessTokens((prev) => ({
            ...prev,
            userToken: response.authResponse.accessToken,
          }));
          setIsUserConnected(true);
        } else {
          setIsUserConnected(false);
        }
      });
    }
  }, [isFbSDKInitialized]);

  // Fetches an access token for the page
  //useEffect(() => {
  //  console.warn('Warning! FB getPageToken re-render! Risk of being blocked!');
  //  if (userId && accessTokens.userToken) {
  //    window.FB.api(
  //      `/${userId}/accounts?access_token=${accessTokens.userToken}`,
  //      (response: FbApiPageAccessResponse) => {
  //        if (response && response.data) {
  //          setAccessTokens((prev) => ({
  //            ...prev,
  //            pageToken: response.data[0].access_token,
  //          }));
  //        }
  //      }
  //    );
  //  }
  //}, [accessTokens.userToken, userId]);

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
                  disabled={!accessTokens.userToken || !isUserConnected}
                />
                {!isUserConnected && !accessTokens.userToken ? (
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
          <Button type='submit' onClick={() => navigate('/')}>
            GO BACK
          </Button>
          <Button type='submit' onClick={submitHandler}>
            CREATE
          </Button>
        </Box>
      )}
    </Box>
  );
};
