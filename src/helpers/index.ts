import { useEffect, useState } from 'react';
import { SavedPost } from '../pages/Root';

export function useLocalStorage() {
  const [posts, setPosts] = useState<SavedPost[]>(
    JSON.parse(localStorage.getItem('posts') || '[]') as SavedPost[]
  );

  function addPost(newPost: SavedPost) {
    const updatedPosts = [...posts, newPost];
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  }

  useEffect(() => {
    const handleStorageChange = () => {
      const newPosts = JSON.parse(
        localStorage.getItem('posts') || '[]'
      ) as SavedPost[];
      setPosts(newPosts);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return [posts, addPost] as [SavedPost[], (value: SavedPost) => void];
}

export function useLogin() {
  const [currentUser, setCurrentUser] = useState<{ login: string }>(
    JSON.parse(localStorage.getItem('user') || `{"login": ""}`) as {
      login: string;
    }
  );

  function logIn(user: { login: string }) {
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  function logOut() {
    setCurrentUser({ login: '' });
    localStorage.setItem('user', JSON.stringify({ login: '' }));
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
