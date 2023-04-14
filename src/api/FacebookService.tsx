import {
  FbApiErrorResponse,
  FbApiPageAccessResponse,
  FbApiPhotoUploadResponse,
  FbApiResponse,
  StatusResponse,
} from './types';

// Класс-модуль для работы с Facebook Pages (сейчас не используется т.к. сайт работает с группой)
export class FacebookPagesApi {
  pageId: string = import.meta.env.VITE_FB_PAGE_ID as string;

  publishToFacebook(
    title: string,
    text: string,
    accessToken: string,
    photo?: string
  ): Promise<string> {
    let postId: string;
    return new Promise((resolve, reject) => {
      if (photo) {
        this.createPost(accessToken, title, text)
          .then((newPostId) => {
            postId = newPostId;
            return this.uploadPhoto(this.pageId, accessToken, photo);
          })
          .then((photoId) =>
            this.updatePost(this.pageId, postId, accessToken, photoId)
          )
          .then((response) => resolve(response))
          .catch((err: string) => reject(err));
      } else {
        this.createPost(accessToken, title, text)
          .then((newPostId) => resolve(newPostId))
          .catch((err: string) => reject(err));
      }
    });
  }

  // запрос и отправка поста без фото
  createPost(
    title: string,
    text: string,
    accessToken: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      // FB - интерфейс работы с апишкой Фейсбука. Поскольку это глобальный интерфейс,
      // он передан в переменную window - браузер.
      // формируем запрос с помощью интерфейса FB
      window.FB.api(
        `/${this.pageId}/feed`, // ссылка на запрос
        'post', // метод запроса (post когда отправляем, get - получаем)
        {
          // тело запроса, т.е. наш пост и "подпись" токеном доступа юзера
          published: true,
          message: `${title}\n\n${text}`,
          access_token: accessToken,
        },
        function (response: FbApiResponse | FbApiErrorResponse) {
          if (FacebookApi.isErrorResponse(response)) {
            console.error(response.error);
            reject(
              `Error! Не вдалося створити пост. ${response.error.message}`
            );
            return;
          } else {
            // ответ возвращает нам два айдишника: айди группы и айди самого поста.
            // Нам нужен лишь айди поста, того разделяем строку и берём вторую часть
            // (в программировании всё начинается с 0, по-этому 1 это вторая половина строки)
            resolve(response.id.split('_')[1]);
          }
        }
      );
    });
  }

  // загружаем фото
  uploadPhoto(
    groupId: string,
    accessToken: string,
    photo: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      window.FB.api(
        `/${groupId}/photos`,
        'post',
        {
          url: photo,
          published: false,
          access_token: accessToken,
        },
        function (response: FbApiPhotoUploadResponse | FbApiErrorResponse) {
          if (FacebookApi.isErrorResponse(response)) {
            console.log(response.error);
            reject(
              `Error! Failed to upload a photo. ${response.error.message}`
            );
          } else {
            resolve(response.id);
          }
        }
      );
    });
  }

  // приделываем к нашему посту фото.
  // Такой подход тут для того, чтобы фото выглядело чистым, без подписей
  // с источниками, откуда мы его взяли и лишних ссылок
  updatePost(
    pageId: string,
    accessToken: string,
    postId: string,
    photoId: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      window.FB.api(
        `/${pageId}_${postId}/`,
        'post',
        {
          attached_media: `[{"media_fbid": ${photoId}}]`,
          access_token: accessToken,
        },
        function (response: FbApiPhotoUploadResponse | FbApiErrorResponse) {
          if (FacebookApi.isErrorResponse(response)) {
            console.log(response.error);
            reject(`Error! Failed to update a post. ${response.error.message}`);
            return;
          } else {
            resolve('Successfully published to Facebook!');
          }
        }
      );
    });
  }
}

// Класс-модуль для работы с Facebook Groups. Практически идентичен с классом выше
export class FacebookGroupsApi {
  private groupId: string = import.meta.env.VITE_FB_GROUP_ID as string;

  publishToFacebook(
    title: string,
    text: string,
    accessToken: string,
    photo?: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      this.createPost(title, text, accessToken, photo)
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }

  createPost(
    title: string,
    text: string,
    accessToken: string,
    photo?: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (photo) {
        window.FB.api(
          `/${this.groupId}/photos`,
          'post',
          {
            url: photo,
            published: true,
            caption: `${title}\n\n${text}`,
            access_token: accessToken,
          },
          function (response: FbApiResponse | FbApiErrorResponse) {
            if (FacebookApi.isErrorResponse(response)) {
              console.error(response.error);
              reject(`Не вдалося створити пост. ${response.error.message}`);
              return;
            } else {
              resolve(response.post_id.split('_')[1]);
            }
          }
        );
      } else {
        window.FB.api(
          `/${this.groupId}/feed`,
          'post',
          {
            published: true,
            message: `${title}\n\n${text}`,
            access_token: accessToken,
          },
          function (response: FbApiResponse | FbApiErrorResponse) {
            if (FacebookApi.isErrorResponse(response)) {
              console.log(response.error);
              reject(
                `Error! Не вдалося створити пост. ${response.error.message}`
              );
              return;
            } else {
              resolve(response.id.split('_')[1]);
            }
          }
        );
      }
    });
  }
}

interface IPublishApi {
  publishToFacebook: (
    title: string,
    text: string,
    accessToken: string,
    photo?: string
  ) => Promise<string>;
}

// Общий класс, использующий классы-модули для публикации и делегирующий их методы
export default class FacebookApi {
  mode: 'group' | 'page';
  isFbSDKInitialized: boolean;
  userId: string | null;
  userToken: string | null;
  pageToken: string | null;
  private facebookGroupApi: IPublishApi = new FacebookGroupsApi(); // класс-модуль

  // тут мы указываем, что мы ждём при инициализации FacebookApi
  // в данном случаем мы ждём режим работы, и класс-модуль (строка 63 в CreateNews.tsx)
  constructor(mode: 'group' | 'page', isFbSDKInitialized: boolean) {
    this.mode = mode;
    this.isFbSDKInitialized = isFbSDKInitialized;
    this.userId = null;
    this.userToken = null;
    this.pageToken = null;
  }

  logIn(): Promise<string> {
    return new Promise((resolve, reject) => {
      window.FB.login((response: StatusResponse) => {
        if (response && response.authResponse) {
          this.userToken = response.authResponse.accessToken;
          this.userId = response.authResponse.userID;
          resolve('Successfully logged in!');
        } else {
          reject('Error! Log in failed!');
        }
      });
    });
  }

  logOut(): Promise<void> {
    return new Promise((resolve) => {
      window.FB.logout(() => {
        resolve();
      });
    });
  }

  // Данный код запускается при переходе на эту страницу и проверяет
  // залогинен ли юзер
  checkLoginStatus(): Promise<{
    connected: boolean;
    userId: string | null;
    userToken: string | null;
  }> {
    return new Promise((resolve, reject) => {
      if (this.isFbSDKInitialized) {
        try {
          window.FB.getLoginStatus((response: StatusResponse) => {
            if (response && response.authResponse) {
              this.userToken = response.authResponse.accessToken;
              this.userId = response.authResponse.userID;

              console.log(response.authResponse.accessToken);

              resolve({
                connected: true,
                userId: this.userId,
                userToken: this.userToken,
              });
            } else {
              // ...иначе указываем что он не залогинен.
              resolve({ connected: false, userId: null, userToken: null });
            }
          });
        } catch (error) {
          console.log(error);
          reject('Login status check failed!');
        }
      }
    });
  }
  // Тут фетчим токен доступа для работы с Page (поскольку работаем с группой - не используем)
  getPageAccessToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.userToken && this.userId !== null) {
        try {
          window.FB.api(
            `/${this.userId}/accounts?access_token=${this.userToken}`,
            (response: FbApiPageAccessResponse) => {
              if (response && response.data) {
                this.pageToken = response.data[0].access_token;
                resolve('Page token successfully fetched!');
              }
            }
          );
        } catch (error) {
          console.log(error);
          reject('Page access token fetch failed!');
        }
      } else {
        reject("User is not logged in! Can't fetch Page access token!");
      }
    });
  }

  // Это функция, которая вызывается юзером, и внутри она вызывает сам метод класса-модуля.
  // Это нужно чтобы упростить наш интерфейс.
  // Таким образом мы легко можем менять классы-модули не меняя интерфейс
  publishToFacebook(title: string, text: string, token: string, photo: string) {
    // Можно придумать логику, которая предусматривает работу и с группой и со страницей,
    // но в нашем случае мы работае либо с тем, либо с тем. Так проще
    return this.facebookGroupApi.publishToFacebook(title, text, token, photo);
  }

  static isErrorResponse<RT>(
    apiResponse: RT | FbApiErrorResponse
  ): apiResponse is FbApiErrorResponse {
    return (apiResponse as FbApiErrorResponse).error !== undefined;
  }
}
