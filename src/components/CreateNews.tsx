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
import { useNotification } from '../helpers';
import { ColorRing } from 'react-loader-spinner';
import { publishToTelegram } from '../api/TelegramService';
import { createTimeStamp, useLocalStorage, useLogin } from '../helpers';
import { useNavigate } from 'react-router-dom';
import FacebookApi from '../api/FacebookService';
import { SavedPost } from '../pages/Root';
import { preRenderedPosts } from '../helpers/mockData';

interface CreateNewsProps {
  isFbSDKInitialized: boolean;
}

export const CreateNews = ({ isFbSDKInitialized }: CreateNewsProps) => {
  const [currentUser] = useLogin(); // Для указания автора
  const [isUserConnected, setIsUserConnected] = useState(false); // состояние юзера
  const [userToken, setUserToken] = useState<string | null>(null);

  // наша функция для создания уведомлений
  const createNotification = useNotification();
  // навигация. С помощью этой функции мы можем отправить юзера "назад" на главную
  const navigate = useNavigate();

  // это наша функция для работы с локальным хранилищем из helpers/index.ts
  // в ней изолирована вся логика по работе с хранилищем, а наружу она просто возвращает
  // интерфейс в виде функций addItem и т.д.
  const [addItem, removeItem, getItem] = useLocalStorage('posts');

  // тут мы имеем переменные для значений формы, и функции для записи этих значений в переменные
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // тут проверка чекбоксов и начала загрузки поста в ФБ и ТГ
  const [isFbChecked, setIsFbChecked] = useState(false);
  const [isTgChecked, setIsTgChecked] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // FB API INIT
  const fbApi = new FacebookApi('group', isFbSDKInitialized);

  // если запрос getLoginStatus вернул ответ с информацией о пользователе - он залогинен
  // Ниже мы сохраняем его айдишник и его токен доступа, которым мы "подписываем" наши запросы
  useEffect(() => {
    fbApi
      .checkLoginStatus()
      .then((response) => {
        if (response.connected && response.userId !== null) {
          setIsUserConnected(true);
          setUserToken(response.userToken);
        } else {
          setIsUserConnected(false);
        }
      })
      .catch((errorResponse: string) => {
        setIsUserConnected(false);
        createNotification({ message: errorResponse, variant: 'error' });
      });
  }, [isFbSDKInitialized]);

  // функция для сброса полей формы. Вызывается после отправки поста.
  function resetForm() {
    setIsFbChecked(false);
    setIsTgChecked(false);
    setTitle('');
    setText('');
    setImageUrl('');
    setIsPublishing(false);
  }

  // функция, которая сохраянет новый пост в локальное хранилище. Тут должна
  // быть логика отправки поста на серв/базу данных.
  async function saveToLocalStorage(ids: {
    fbPostId: string;
    tgPostId: number;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Чтобы учитывалась и длина тестовых постов
        const posts = getItem<SavedPost[]>();
        const postsLength = [...new Set(preRenderedPosts.concat(posts))];
        // addItem - метод, который сохраняет пост в локальное хранилище
        // сам метод получаем из нашей функции для работы с хранилищем useLocalStorage вверху
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
            time: createTimeStamp(), // функция для создания даты (в файле helpers/index.ts )
          },
        ]);
        resolve('Успішно збережено у базі даних!');
      } catch (error) {
        reject('Error! Не вдалося зберегти в базу даних!');
      }
    });
  }

  // функция, которая вызывает окно авторизации в ФБ
  function handleLogIn() {
    fbApi
      .logIn()
      .then(() => {
        setIsUserConnected(true);
      })
      .catch((err: string) =>
        createNotification({ message: err, variant: 'error' })
      );
  }

  // Функция, которая разлогинивает с ФБ
  function handleLogOut() {
    fbApi
      .logOut()
      .then(() => {
        setIsUserConnected(false);
      })
      .catch((err) => console.error(err));
  }

  // Главная функция страницы. Тут вся логика, описанная выше, начинает работать.
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

      // проверяем стоит ли отметка публикации в Телеграм. Если да, код в if{} запустится
      if (isTgChecked) {
        await publishToTelegram(title, text, imageUrl)
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

      // проверяем стоит ли отметка публикации в Фейсбук. Если да, код в if{} запустится
      if (isFbChecked && userToken !== null) {
        await fbApi
          .publishToFacebook(title, text, userToken, imageUrl)
          .then((response) => {
            createNotification({
              message: 'Успішно опубліковано на Facebook!',
              variant: 'success',
            });
            fbPostId = response;
          })
          .catch((err: string) => {
            console.error('Failed to post to Facebook. ', err);
            createNotification({
              message: err,
              variant: 'error',
            });
          });
      }

      // возвращаем объект с полями fbPostId, tgPostId, в которых айдишники постов
      return { fbPostId, tgPostId };
    }

    // проверяем не пустой ли пост мы собираемся отправить.
    if (text.length > 0 && title.length > 0) {
      // вызов той функции выше. Тут уже всё и запускается.
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

  // тут уже псевдо HTML формы (псевдо, потому что это не HTML а JSX)
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
                    disabled={!isUserConnected}
                  />
                  {isUserConnected ? (
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
                {!isUserConnected ? (
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
