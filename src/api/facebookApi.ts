import {
  FbApiResponse,
  FbApiErrorResponse,
  FbApiPhotoUploadResponse,
} from './types';

export const publishToFacebook = async (
  groupId: string,
  userAccessToken: string,
  //accessTokens: {
  //  userToken: string;
  //  pageToken: string;
  //},
  photo: string,
  title: string,
  text: string
) => {
  const postId = '';

  // Flow for Pages
  //createPost(groupId, accessTokens.pageToken, title, text)
  //.then<string>((newPostId) => {
  //  postId = newPostId;
  //  return uploadPhoto(groupId, accessTokens.pageToken, photo);
  //})
  //.then<string>((photoId) =>
  //  updatePost(groupId, postId, accessTokens.pageToken, photoId)
  //)
  //.catch<string>((err: string) => {
  //  throw new Error(err);
  //})

  return createPost(groupId, photo, userAccessToken, title, text).catch<string>(
    (err: string) => {
      throw new Error(err);
    }
  );
};

async function createPost(
  groupId: string,
  photo: string,
  //pageAccessToken: string, For Pages
  userAccessToken: string,
  title: string,
  text: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    window.FB.api(
      `/${groupId}/photos`,
      'post',
      {
        url: photo,
        published: true,
        caption: `${title}\n\n${text}`,
        access_token: userAccessToken,
        //access_token: pageAccessToken, For Pages
      },
      function (response: FbApiResponse | FbApiErrorResponse) {
        console.log('Response from creating post: ', response);
        if (isErrorResponse(response)) {
          console.log(response.error);
          reject(`Error! Failed to create a post. ${response.error.message}`);
          return;
        } else {
          resolve('Successfully published to Facebook!');
          //resolve(response.id.split('_')[1]); For Pages flow
        }
      }
    );
  });
}

async function uploadPhoto(
  groupId: string,
  //pageAccessToken: string,
  userAccessToken: string,
  photo: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    window.FB.api(
      `/${groupId}/photos`,
      'post',
      {
        url: photo,
        published: false,
        access_token: userAccessToken,
        //access_token: pageAccessToken,
      },
      function (response: FbApiPhotoUploadResponse | FbApiErrorResponse) {
        console.log('Response from uploadPhoto: ', response);
        if (isErrorResponse(response)) {
          console.log(response.error);
          reject(`Error! Failed to upload a photo. ${response.error.message}`);
        } else {
          resolve(response.id);
        }
      }
    );
  });
}

// For Pages only
//async function updatePost(
//  groupId: string,
//  pageAccessToken: string,
//  postId: string,
//  photoId: string,
//): Promise<string> {
//  return new Promise((resolve, reject) => {
//    window.FB.api(
//      `/${groupId}_${postId}/`,
//      'post',
//      {
//        attached_media: `[{"media_fbid": ${photoId}}]`,
//        access_token: pageAccessToken,
//      },
//      function (response: FbApiPhotoUploadResponse | FbApiErrorResponse) {
//        console.log('Response from updatePost: ', response);
//        if (isErrorResponse(response)) {
//          console.log(response.error);
//          reject(`Error! Failed to update a post. ${response.error.message}`);
//          return;
//        } else {
//          resolve('Successfully published to Facebook!');
//        }
//      }
//    );
//  });
//}

function isErrorResponse<RT>(
  apiResponse: RT | FbApiErrorResponse
): apiResponse is FbApiErrorResponse {
  return (apiResponse as FbApiErrorResponse).error !== undefined;
}

type Tokens = {
  userToken: string;
  pageToken: string;
};
export function isTokensNotUndefined(tokens: {
  userToken: string | undefined;
  pageToken: string | undefined;
}): tokens is Tokens {
  return (
    (tokens as Tokens).userToken !== undefined &&
    (tokens as Tokens).pageToken !== undefined
  );
}
