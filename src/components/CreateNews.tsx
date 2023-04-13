import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';
import { StatusResponse } from '../api/types';
import { useNotification } from '../helpers';
import { ColorRing } from 'react-loader-spinner';
import { createNews } from '../api/TelegramService';
import { createTimeStamp, useLocalStorage, useLogin } from '../helpers';
import { useNavigate } from 'react-router-dom';
import FacebookApi, { FacebookGroupsApi } from '../api/FacebookService';
import { SavedPost } from '../pages/Root';
import { preRenderedPosts } from '../helpers/mockData';

interface CreateNewsProps {
  isFbSDKInitialized: boolean;
}

export const CreateNews = ({ isFbSDKInitialized }: CreateNewsProps) => {
  // Needed for FB Pages
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userId, setUserId] = useState<undefined | string>(undefined);
  const [currentUser] = useLogin(); // Для указания автора
  const [isUserConnected, setIsUserConnected] = useState(false);
  const [accessTokens, setAccessTokens] = useState<{
    userToken: string | undefined;
    pageToken: string | undefined;
  }>({
    userToken: undefined,
    pageToken: undefined,
  });

  const createNotification = useNotification();
  const navigate = useNavigate();
  const [addItem, removeItem, getItem] = useLocalStorage('posts');

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [isFbChecked, setIsFbChecked] = useState(false);
  const [isTgChecked, setIsTgChecked] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // FB API INIT
  const fbApi = new FacebookApi('group', new FacebookGroupsApi());

  // Checks if the user is logged in to Facebook
  useEffect(() => {
    if (isFbSDKInitialized) {
      window.FB.getLoginStatus((response: StatusResponse) => {
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

  // Fetches an access token for the FB Page (uncomment if working with Pages)
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

  function resetForm() {
    setIsFbChecked(false);
    setIsTgChecked(false);
    setTitle('');
    setText('');
    setImageUrl('');
    setIsPublishing(false);
  }

  async function saveToLocalStorage(ids: {
    fbPostId: string;
    tgPostId: number;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Чтобы учитывалась и длина мок постов
        const posts = getItem<SavedPost[]>();
        const postsLength = [...new Set(preRenderedPosts.concat(posts))];

        addItem<SavedPost[]>([
          ...posts,
          {
            id: postsLength.length,
            author: currentUser.login,
            text,
            title,
            imageUrl,
            publishedTo: {
              telegram: [isTgChecked, ids.tgPostId],
              facebook: [isFbChecked, ids.fbPostId],
            },
            time: createTimeStamp(),
          },
        ]);
        resolve('Успішно збережено у базі даних!');
      } catch (error) {
        reject('Error! Не вдалося зберегти в базу даних!');
      }
    });
  }

  function handleLogIn() {
    fbApi
      .logIn()
      .then((response) => {
        if (typeof response !== 'string') {
          setAccessTokens(response);
          setIsUserConnected(true);
        }
      })
      .catch((err: string) =>
        createNotification({ message: err, variant: 'error' })
      );
  }

  function handleLogOut() {
    fbApi
      .logOut()
      .then(() => {
        const tokens = {
          userToken: undefined,
          pageToken: undefined,
        };
        setAccessTokens(tokens);
        setIsUserConnected(false);
      })
      .catch((err) => console.error(err));
  }

  function submitHandler(): void {
    if (!confirm('Опублікувати цей пост?')) {
      return;
    }

    async function startPublish(): Promise<{
      fbPostId: string;
      tgPostId: number;
    }> {
      let fbPostId = '';
      let tgPostId = 0;

      setIsPublishing(true);

      if (isTgChecked) {
        await createNews(title, text, imageUrl)
          .then((response) => {
            createNotification({
              message: 'Успішно опубліковано в Telegram!',
              variant: 'success',
            });
            tgPostId = response as number;
          })
          .catch((error: string) => {
            createNotification({ message: error, variant: 'error' });
          });
      }

      if (isFbChecked && fbApi.isTokensNotUndefined(accessTokens)) {
        await fbApi
          .publishToFacebook(title, text, accessTokens, imageUrl)
          .then((response) => {
            createNotification({
              message: 'Успішно опубліковано на Facebook!',
              variant: 'success',
            });
            fbPostId = response;
          })
          .catch((err: string) => {
            console.error('Error! Failed to post to Facebook. ', err);
            createNotification({
              message: err,
              variant: 'error',
            });
          });
      }

      return { fbPostId, tgPostId };
    }

    if (text.length > 0 && title.length > 0) {
      startPublish()
        .then((ids) => saveToLocalStorage(ids))
        .then((result) => {
          createNotification({ message: result, variant: 'success' });
        })
        .finally(() => resetForm())
        .catch((err) => console.error(err));
    } else {
      createNotification({
        message: 'Ви не можете створити порожній пост.',
        variant: 'warning',
      });
    }
  }

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
            onChange={(e) => setTitle(e.target.value)}
            id='standard-basic'
            label='ТЕМА'
            variant='standard'
          />

          <TextareaAutosize
            aria-label='minimum height'
            minRows={6}
            placeholder='Текст посту...'
            onChange={(e) => setText(e.target.value)}
            style={{ width: '100%' }}
          />

          <TextField
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value.trim())}
            id='standard-basic'
            label='URL зображення (image address)'
            variant='standard'
          />

          <Box my={2}>
            <Typography variant='subtitle1'>Де опублікувати?</Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                label='Telegram'
                checked={isTgChecked}
                onChange={(e: SyntheticEvent, checked: boolean) => {
                  setIsTgChecked(checked);
                }}
              />
              <Box display={'flex'} flexDirection={'column'}>
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
                  {accessTokens.userToken || isUserConnected ? (
                    <Button
                      size='small'
                      variant='outlined'
                      color='error'
                      type='submit'
                      onClick={handleLogOut}
                    >
                      disconnect
                    </Button>
                  ) : (
                    <Button
                      size='small'
                      variant='outlined'
                      color='success'
                      type='submit'
                      onClick={handleLogIn}
                    >
                      connect
                    </Button>
                  )}
                </Box>
                {!isUserConnected && !accessTokens.userToken ? (
                  <Alert variant='standard' severity='warning'>
                    Ви не підключені до Facebook. Будь ласка, увійдіть в свій
                    обліковий запис адміністратора на Facebook.
                  </Alert>
                ) : (
                  <Alert variant='standard' severity='success'>
                    Підключено до Facebook API
                  </Alert>
                )}
              </Box>
            </FormGroup>
          </Box>

          <Box display={'flex'} justifyContent={'space-around'}>
            <Button
              color='warning'
              variant='contained'
              type='submit'
              onClick={() => navigate('/')}
            >
              НАЗАД
            </Button>
            <Button
              color='primary'
              variant='contained'
              type='submit'
              onClick={submitHandler}
            >
              СТВОРИТИ
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};
