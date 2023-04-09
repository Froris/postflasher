import { useState } from 'react';
import {
  FbApiResponse,
  FbApiErrorResponse,
  FbApiPhotoUploadResponse,
} from './types';
import { Title } from '@mui/icons-material';

export const publishToFacebook = async (
  pageId: string,
  pageAccessToken: string,
  photo: string,
  title: string,
  text: string
) => {
  let postId = '';

  return createPost(pageId, pageAccessToken, title, text)
    .then((newPostId) => {
      postId = newPostId;
      return uploadPhoto(pageId, pageAccessToken, photo);
    })
    .then((photoId) => updatePost(pageId, postId, photoId))
    .catch((err: string) => err);
};

async function createPost(
  pageId: string,
  pageAccessToken: string,
  title: string,
  text: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    window.FB.api(
      `/${pageId}/feed`,
      'post',
      {
        published: false,
        message: `${title}\n\n${text}`,
        access_token: pageAccessToken,
      },
      function (response: FbApiResponse | FbApiErrorResponse) {
        if (isErrorResponse(response)) {
          console.log(response.error);
          reject(`Error! Failed to create a post. ${response.error.message}`);
          return;
        } else {
          resolve(response.id.split('_')[1]);
        }
      }
    );
  });
}

async function uploadPhoto(
  pageId: string,
  pageAccessToken: string,
  photo: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    window.FB.api(
      `/${pageId}/photos`,
      'post',
      {
        url: photo,
        published: false,
        access_token: pageAccessToken,
      },
      function (response: FbApiPhotoUploadResponse | FbApiErrorResponse) {
        if (isErrorResponse(response)) {
          console.log(response.error);
          reject(`Error! Failed to upload a photo. ${response.error.message}`);
        } else {
          console.log('upload photo response: ', response);
          resolve(response.id);
        }
      }
    );
  });
}

async function updatePost(pageId: string, postId: string, photoId: string) {
  console.log(
    'update post: [pageId, postId, photoId]',
    pageId,
    postId,
    photoId
  );
  return new Promise((resolve, reject) => {
    window.FB.api(
      `/${pageId}_${postId}/`,
      'post',
      {
        attached_media: `[{"media_fbid": ${photoId}}]`,
      },
      function (response: FbApiPhotoUploadResponse | FbApiErrorResponse) {
        if (isErrorResponse(response)) {
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

function isErrorResponse<RT>(
  apiResponse: RT | FbApiErrorResponse
): apiResponse is FbApiErrorResponse {
  return (apiResponse as FbApiErrorResponse).error !== undefined;
}
