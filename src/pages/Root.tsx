import { CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { useInitFbSDK } from '../api/connectToFB';
import { useState } from 'react';
import { AdminsList, adminsList } from '../helpers/mockData';

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
  allowedUsers: AdminsList;
  currentUser: string;
  setCurrentUser: (value: string) => void;
}

export const Root = () => {
  // For login form
  const [currentUser, setCurrentUser] = useState('');
  const allowedUsers = adminsList;
  // Initializes the Facebook SDK
  const isFbSDKInitialized = useInitFbSDK();

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
