import TelegramIcon from '@mui/icons-material/Telegram';
import FacebookIcon from '@mui/icons-material/Facebook';
import { SavedPost } from '../pages/Root';
import { Box, IconButton, Link, Typography } from '@mui/material';
import { useLocalStorage, useNotification } from '../helpers';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { preRenderedPosts } from '../helpers/mockData';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { deleteMessage } from '../api/TelegramService';

const tgChatId = (import.meta.env.VITE_TG_CHAT_ID as string).split('@')[1];
const fbGroupId = import.meta.env.VITE_FB_GROUP_ID as string;

export default function Table() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addItem, removeItem, getItem] = useLocalStorage('posts');
  const createNotification = useNotification();
  const [posts, setPosts] = useState<SavedPost[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 3,
    page: 0,
  });

  function handleDelete(postId: number, messageId: number) {
    deleteMessage(messageId)
      .then((response) =>
        createNotification({ message: response, variant: 'success' })
      )
      .then(() => {
        const updatedPosts = posts.filter((post) => post.id !== postId);
        setPosts([...updatedPosts]);
        addItem(updatedPosts);
      })
      .catch((err: string) =>
        createNotification({ message: err, variant: 'error' })
      );
  }

  useEffect(() => {
    const fetchedPosts = getItem<SavedPost[]>();
    console.log('fetched posts', fetchedPosts);
    setPosts([...fetchedPosts]);
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      renderCell: ({ row }: GridRenderCellParams<SavedPost>) => {
        const { id } = row;

        return (
          <Typography
            sx={{
              fontWeight: 'bold',
            }}
          >
            {id}
          </Typography>
        );
      },
    },
    {
      field: 'idauthor',
      headerName: 'АВТОР',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<SavedPost>) => {
        const { author } = row;

        return (
          <Typography
            sx={{
              color: '#1976d2',
              fontWeight: 'bold',
            }}
          >
            {author}
          </Typography>
        );
      },
    },
    {
      field: 'title',
      headerName: 'ТЕМА',
      flex: 2,
    },
    {
      field: 'imageUrl',
      headerName: 'ЗОБРАЖЕННЯ',
      flex: 3,
      renderCell: ({ row }: GridRenderCellParams<SavedPost>) => {
        const { imageUrl } = row;

        return (
          <>
            {imageUrl ? (
              <Box
                p={1}
                height={'200px'}
                display='flex'
                justifyContent='center'
              >
                <img src={imageUrl} alt='post' />
              </Box>
            ) : (
              <Typography>Без зображення</Typography>
            )}
          </>
        );
      },
    },
    {
      field: 'time',
      headerName: 'ДАТА',
      flex: 1,
    },
    {
      field: 'publishedTo',
      headerName: 'ОПУБЛІКОВАНО',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<SavedPost>) => {
        const {
          publishedTo: { telegram, facebook },
        } = row;

        const [tgIsPublished, tgMessageId] = telegram;
        const [fbIsPublished, fbMessageId] = facebook;

        return (
          <Box display='flex' justifyContent='center' flexDirection={'column'}>
            {tgIsPublished && (
              <Box display={'flex'} gap={1} alignItems={'flex-end'}>
                <TelegramIcon color='primary' />
                <Link
                  underline={'none'}
                  href={`https://t.me/${tgChatId}/${tgMessageId}`}
                >
                  <Typography color='primary' variant='subtitle2'>
                    Telegram
                  </Typography>
                </Link>
              </Box>
            )}
            {fbIsPublished && (
              <Box display={'flex'} gap={1} alignItems={'flex-end'}>
                <FacebookIcon color='primary' />
                <Link
                  underline={'none'}
                  href={`https://www.facebook.com/groups/${fbGroupId}/permalink/${fbMessageId}/`}
                >
                  <Typography color='primary' variant='subtitle2'>
                    Facebook
                  </Typography>
                </Link>
              </Box>
            )}
          </Box>
        );
      },
    },
    {
      field: 'delete',
      headerName: 'ВИДАЛИТИ',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<SavedPost>) => {
        const { id, publishedTo } = row;
        return (
          <IconButton onClick={() => handleDelete(id, publishedTo.telegram[1])}>
            <DeleteForeverIcon />
          </IconButton>
        );
      },
    },
  ];

  return (
    <Box maxWidth={'100%'} height={'800px'}>
      {preRenderedPosts || (posts && posts.length > 0) ? (
        <DataGrid
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[3, 10, 15]}
          sx={{
            borderColor: '#92c9ff',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#eef7ff',
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: '#eef7ff',
            },
          }}
          getRowHeight={() => 'auto'}
          rows={[...new Set(preRenderedPosts.concat(posts))]}
          columns={columns}
        />
      ) : (
        <Typography>Поки що немає жодного посту...</Typography>
      )}
    </Box>
  );
}
