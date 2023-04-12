import {
  FbApiErrorResponse,
  FbApiPhotoUploadResponse,
  FbApiResponse,
  StatusResponse,
  Tokens,
} from './types';

// Класс-модуль для работы с Facebook Pages
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

  createPost(
    title: string,
    text: string,
    accessToken: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      window.FB.api(
        `/${this.pageId}/feed`,
        'post',
        {
          published: true,
          message: `${title}\n\n${text}`,
          access_token: accessToken,
        },
        function (response: FbApiResponse | FbApiErrorResponse) {
          console.log('FB response: ', response);
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
    });
  }

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
          console.log('Response from uploadPhoto: ', response);
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
          console.log('Response from updatePost: ', response);
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

// Класс-модуль для работы с Facebook Groups
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
            console.log('FB response: ', response);
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
  appId: string = import.meta.env.VITE_FB_APP_ID as string;
  fbPublishApi: IPublishApi;

  constructor(mode: 'group' | 'page', fbPublishApi: FacebookGroupsApi) {
    this.fbPublishApi = fbPublishApi;
    this.mode = mode;
  }

  logIn(): Promise<
    { userToken: string; pageToken: string | undefined } | string
  > {
    return new Promise((resolve, reject) => {
      window.FB.login((response: StatusResponse) => {
        if (response && response.authResponse) {
          resolve({
            userToken: response.authResponse.accessToken,
            pageToken: undefined,
          });
        } else {
          reject('Error! Log i failed!');
        }
      });
    });
  }

  logOut(): Promise<void> {
    return new Promise((resolve) => {
      window.FB.logout(() => {
        console.log(window.FB);
        resolve();
      });
    });
  }

  publishToFacebook(
    title: string,
    text: string,
    accessToken: {
      userToken: string;
      pageToken: string;
    },
    photo: string
  ) {
    const token =
      this.mode === 'group' ? accessToken.userToken : accessToken.pageToken;
    return this.fbPublishApi.publishToFacebook(title, text, token, photo);
  }

  static isErrorResponse<RT>(
    apiResponse: RT | FbApiErrorResponse
  ): apiResponse is FbApiErrorResponse {
    return (apiResponse as FbApiErrorResponse).error !== undefined;
  }

  isTokensNotUndefined(tokens: {
    userToken: string | undefined;
    pageToken: string | undefined;
  }): tokens is Tokens {
    if (this.mode === 'page') {
      return (
        (tokens as Tokens).userToken !== undefined &&
        (tokens as Tokens).pageToken !== undefined
      );
    } else {
      return (tokens as Tokens).userToken !== undefined;
    }
  }
}
