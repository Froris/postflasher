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
import {
  AuthResponse,
  FbApiPageAccessResponse,
  StatusResponse,
} from '../api/types';
import { ColorRing } from 'react-loader-spinner';

interface CreateNewsProps {
  isFbSDKInitialized: boolean;
}

const pageId = import.meta.env.VITE_FB_PAGE_ID as string;

// TODO: вынести логику логина/логаута в отдельный компонент с кнопкой
// TODO: вынести функционал авторизации в отдельный класс в facebookApi
export const CreateNews = ({ isFbSDKInitialized }: CreateNewsProps) => {
  const [isUserConnected, setIsUserConnected] = useState(true);
  const [accessTokens, setAccessTokens] = useState<{
    userToken: string | undefined;
    pageToken: string | undefined;
  }>({
    userToken: undefined,
    pageToken: undefined,
  });
  //const [fbUserAccessToken, setFbUserAccessToken] = useState<null | string>();
  //const [fbPageAccessToken, setFbPageAccessToken] = useState<null | string>();

  const [userId, setUserId] = useState<undefined | string>(undefined);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [isFbChecked, setIsFbChecked] = useState(false);
  const [isTgChecked, setIsTgChecked] = useState(false);

  const [isPublishing, setIsPublishing] = useState(false);

  // Logs in a Facebook user
  const logInToFB = useCallback(() => {
    window.FB.login((response: StatusResponse) => {
      //setFbUserAccessToken(response.authResponse.accessToken);
      setAccessTokens((prev) => ({
        ...prev,
        userToken: response.authResponse.accessToken,
      }));
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
    });
  }, []);

  function submitHandler(): void {
    // Проверяем, что была введена ссылка на картинку
    if (!imageUrl) {
      alert('Please enter an image URL');
      return;
    }

    async function startPublish() {
      setIsPublishing(true);

      if (isTgChecked) {
        // Отправляем картинку и текст в telegram
        //createNews(title, text, imageUrl)
        //  .then(() => {
        //    alert('News created successfully');
        //  })
        //  .catch((error) => {
        //    console.error(error);
        //    alert('Error creating news');
        //  });
      }

      if (isFbChecked && accessTokens.userToken && accessTokens.pageToken) {
        const response = await publishToFacebook(
          pageId,
          accessTokens.pageToken,
          imageUrl,
          title,
          text
        )
          .then((response) => {
            alert(response);
          })
          .catch((err) =>
            console.warn('Error! Failed to post to Facebook. ', err)
          );

        console.log('response of publishToFacebook');
      } else {
        alert('You are not connected to Facbook!');
      }

      //return Promise.all([createPost(pageId, pageAccessToken, title, text)])
      //.then(() => 'Successfully published to Facebook!')
      //.catch((err: string) => err);
    }

    startPublish()
      .then(() => setIsPublishing(false))
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
          setAccessTokens((prev) => ({
            ...prev,
            pageToken: response.data[0].access_token,
          }));
        }
      );
    }
  }, [accessTokens.userToken, userId]);

  //console.log('UserAccessToken: ', fbUserAccessToken);
  //console.log('PageAccessToken: ', fbPageAccessToken);
  //console.log('FBP access token: ', !!fbPageAccessToken);

  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      width={'600px'}
      height={'600px'}
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
        <Box display={'flex'} flexDirection={'column'} gap={2}>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id='standard-basic'
            label='Title'
            variant='standard'
          />

          <TextareaAutosize
            aria-label='minimum height'
            minRows={6}
            placeholder='News text...'
            onChange={(e) => setText(e.target.value)}
            style={{ width: '400px' }}
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
                control={<Checkbox defaultChecked />}
                label='Telegram'
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
          <Button type='submit' onClick={submitHandler}>
            CREATE
          </Button>
        </Box>
      )}
    </Box>
  );
};
