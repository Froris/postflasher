import { useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { Box } from '@mui/material';
import { ClearStorageBtn } from '../ClearStorageBtn';
import { MainCreateButton } from '../MainCreateButton';
import { Table } from './Table';
import { useLocalStorage, useNotification } from '../../helpers';
import { SavedPost } from '../../pages/Root';
import { deleteMessage } from '../../api/TelegramService';

export const TableContainer = ({
  navigate,
}: {
  navigate: NavigateFunction;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addItem, removeItem, getItem] = useLocalStorage('posts');
  const [posts, setPosts] = useState<SavedPost[]>(getItem<SavedPost[]>());
  const createNotification = useNotification();

  function handleDeleteTableItem(
    postId: number,
    publishedTo: { telegram: [boolean, number]; facebook: [boolean, string] }
  ) {
    const { telegram } = publishedTo;

    if (telegram[0]) {
      deleteMessage(telegram[1])
        .then((response) =>
          createNotification({ message: response, variant: 'success' })
        )
        .catch((err: string) =>
          createNotification({ message: err, variant: 'error' })
        );
    }

    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts([...updatedPosts]);
    addItem(updatedPosts);
  }

  return (
    <Box
      m={2}
      width={'100%'}
      overflow={'hidden'}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Box width={'100%'} display={'flex'} justifyContent={'space-between'}>
        <MainCreateButton postsLength={2 + posts.length} navigate={navigate} />
        <ClearStorageBtn navigate={navigate} />
      </Box>

      <Table posts={posts} onDeleteItem={handleDeleteTableItem} />
    </Box>
  );
};
