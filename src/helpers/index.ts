import { useEffect, useState } from 'react';
import { SavedPost } from '../pages/Root';
import { useSnackbar } from 'notistack';

//export function useLocalStorage() {
//  const [posts, setPosts] = useState<SavedPost[]>(
//    JSON.parse(localStorage.getItem('posts') || '[]') as SavedPost[]
//  );

//  function addPost(newPost: SavedPost) {
//    const updatedPosts = [...posts, newPost];
//    setPosts(updatedPosts);
//    localStorage.setItem('posts', JSON.stringify(updatedPosts));
//  }

//  useEffect(() => {
//    const handleStorageChange = () => {
//      const newPosts = JSON.parse(
//        localStorage.getItem('posts') || '[]'
//      ) as SavedPost[];
//      setPosts(newPosts);
//    };

//    window.addEventListener('storage', handleStorageChange);

//    return () => {
//      window.removeEventListener('storage', handleStorageChange);
//    };
//  }, []);

//  return [posts, addPost] as [SavedPost[], (value: SavedPost) => void];
//}

export function useLocalStorage(key: string) {
  function addItem<T>(item: T) {
    localStorage.setItem(key, JSON.stringify(item));
  }

  function removeItem() {
    localStorage.removeItem(key);
  }

  function getItem<T>(): T {
    const items = JSON.parse(localStorage.getItem(key) || '[]') as T;
    return items;
  }

  return [addItem, removeItem, getItem] as [
    <T>(value: T) => void,
    () => void,
    <T>() => T
  ];
}

export function useLogin() {
  const [addItem, removeItem, getItem] = useLocalStorage('user');

  const [currentUser, setCurrentUser] = useState<{ login: string }>(
    getItem<{ login: string }>()
  );

  function logIn(user: { login: string }) {
    setCurrentUser(user);
    addItem<{ login: string }>(user);
  }

  function logOut() {
    setCurrentUser({ login: '' });
    removeItem();
  }

  return [currentUser, logIn, logOut] as [
    { login: string },
    (value: { login: string }) => void,
    () => void
  ];
}

export function createTimeStamp() {
  const date = new Date();
  const {
    hours,
    minutes,
    date: day,
    month,
    fullYear: year,
  } = {
    hours: date.getHours().toString().padStart(2, '0'),
    minutes: date.getMinutes().toString().padStart(2, '0'),
    date: date.getDate().toString().padStart(2, '0'),
    month: (date.getMonth() + 1).toString().padStart(2, '0'),
    fullYear: date.getFullYear().toString(),
  };

  return `${hours}:${minutes} ${day}.${month}.${year}`;
}

type Notification = {
  message: string;
  variant: 'error' | 'warning' | 'success';
};

export function useNotification() {
  const { enqueueSnackbar } = useSnackbar();

  function createNotification({ message, variant }: Notification) {
    enqueueSnackbar(message, {
      variant,
      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    });
  }

  return createNotification;
}
