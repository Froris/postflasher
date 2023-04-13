import { useState } from 'react';
import { useSnackbar } from 'notistack';

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
      autoHideDuration: 8000,
      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    });
  }

  return createNotification;
}
