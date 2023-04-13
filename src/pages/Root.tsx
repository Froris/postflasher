import { CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { useInitFbSDK } from '../api/connectToFB';
import { useEffect, useMemo, useState } from 'react';

export interface Post {
  title: string;
  text: string;
  imageUrl: string;
}

export interface SavedPost extends Post {
  id: number;
  author: string;
  publishedTo: {
    telegram: [boolean, number];
    facebook: [boolean, string];
  };
  time: string;
}

export interface OutletProps {
  preRenderedPosts: SavedPost[];
  isFbSDKInitialized: boolean;
  allowedUsers: Array<{ login: string; password: string }>;
  currentUser: string;
  setCurrentUser: (value: string) => void;
}

export const Root = () => {
  const [currentUser, setCurrentUser] = useState('');
  // Initializes the Facebook SDK
  const isFbSDKInitialized = useInitFbSDK();
  const allowedUsers = useMemo(
    (): Array<{ login: string; password: string }> => [
      {
        login: 'admin@admin',
        password: 'admin',
      },
      {
        login: 'random@mail',
        password: 'admin',
      },
      {
        login: 'fox@mail',
        password: 'admin',
      },
      {
        login: 'joe@mail',
        password: 'admin',
      },
    ],
    []
  );

  return (
    <>
      <CssBaseline />
      <SnackbarProvider maxSnack={4} autoHideDuration={8000}>
        <Outlet
          context={{
            isFbSDKInitialized,
            allowedUsers,
            currentUser,
            setCurrentUser,
          }}
        />
      </SnackbarProvider>
    </>
  );
};
