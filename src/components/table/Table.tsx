import { useState } from 'react';
import TelegramIcon from '@mui/icons-material/Telegram';
import FacebookIcon from '@mui/icons-material/Facebook';
import { Box, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { SavedPost } from '../../pages/Root';
import { preRenderedPosts } from '../../helpers/mockData';
import AppButton from '../styled/StyledButtons';

const tgChatId = (import.meta.env.VITE_TG_CHAT_ID as string).split('@')[1];
const fbGroupId = import.meta.env.VITE_FB_GROUP_ID as string;

type TableProps = {
  posts: SavedPost[];
  onDeleteItem: (
    id: number,
    publishedTo: { telegram: [boolean, number]; facebook: [boolean, string] }
  ) => void;
};

export const Table = ({ posts, onDeleteItem }: TableProps) => {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  // Настройка колонок для таблицы
  const columns: GridColDef[] = [
    {
      field: 'imageUrl',
      headerName: '',
      width: 260,
      sortable: false,
      renderCell: ({ row }: GridRenderCellParams<SavedPost>) => {
        const { imageUrl } = row;

        return (
          <Box pl={'10px'} display={'flex'} justifyContent={'center'}>
            {imageUrl ? (
              <img
                style={{
                  width: '242px',
                  height: '221px',
                  objectFit: 'cover',
                  borderRadius: '20px',
                }}
                src={imageUrl}
                alt='post'
              />
            ) : (
              <Typography>Без зображення</Typography>
            )}
          </Box>
        );
      },
    },

    {
      field: 'information',
      headerName: 'ТЕМА / ДЕ ОПУБЛІКОВАНО',
      width: 390,
      sortable: false,
      renderCell: ({ row }: GridRenderCellParams<SavedPost>) => {
        const {
          title,
          publishedTo: { telegram, facebook },
        } = row;

        const [tgIsPublished, tgMessageId] = telegram;
        const [fbIsPublished, fbMessageId] = facebook;

        return (
          <Box
            mx={'12px'}
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'flex-start'}
            rowGap={2}
          >
            <Typography
              variant='h5'
              component={'p'}
              sx={{
                whiteSpace: 'normal',
                width: '100%',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {title}
            </Typography>

            <Box display='flex' justifyContent='center' columnGap={3}>
              {tgIsPublished && (
                <Box
                  display={'flex'}
                  p={1}
                  gap={1}
                  justifyContent={'center'}
                  alignItems={'flex-end'}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                  }}
                >
                  <TelegramIcon color='primary' />
                  <Link
                    underline={'none'}
                    href={`https://t.me/${tgChatId}/${tgMessageId}`}
                  >
                    <Typography
                      sx={{
                        color: '#673D87',
                        fontWeight: 'bold',
                      }}
                      variant='subtitle2'
                    >
                      Telegram
                    </Typography>
                  </Link>
                </Box>
              )}
              {fbIsPublished && (
                <Box
                  display={'flex'}
                  p={1}
                  gap={1}
                  justifyContent={'center'}
                  alignItems={'flex-end'}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                  }}
                >
                  <FacebookIcon color='primary' />
                  <Link
                    underline={'none'}
                    href={`https://www.facebook.com/groups/${fbGroupId}/permalink/${fbMessageId}/`}
                  >
                    <Typography
                      color='primary'
                      variant='subtitle2'
                      sx={{
                        color: '#673D87',
                        fontWeight: 'bold',
                      }}
                    >
                      Facebook
                    </Typography>
                  </Link>
                </Box>
              )}
            </Box>
          </Box>
        );
      },
    },

    {
      field: 'time',
      headerName: 'СОРТУВАТИ ЗА ДАТОЮ',
      width: 230,
      sortingOrder: ['asc', 'desc'],
      renderCell: ({ row }: GridRenderCellParams<SavedPost>) => {
        const { time } = row;
        return (
          <Typography
            variant='h6'
            component={'p'}
            sx={{
              color: 'white',
            }}
          >
            {time}
          </Typography>
        );
      },
    },

    {
      field: 'author',
      headerName: 'АВТОР',
      width: 180,
      sortable: false,
      renderCell: ({ row }: GridRenderCellParams<SavedPost>) => {
        const { author } = row;

        return (
          <Typography
            sx={{
              color: '#ffd57a',
              fontWeight: 'bold',
            }}
          >
            {author}
          </Typography>
        );
      },
    },

    {
      field: 'delete',
      headerName: 'ВИДАЛИТИ',
      width: 110,
      sortable: false,
      renderCell: ({ row }: GridRenderCellParams<SavedPost>) => {
        const { id, publishedTo } = row;
        return (
          <AppButton
            className='FormButton-delete'
            variant='contained'
            onClick={() => onDeleteItem(id, publishedTo)}
          >
            <DeleteForeverIcon fontSize='large' color='error' />
          </AppButton>
        );
      },
    },
  ];

  return (
    <Box
      width={'100%'}
      height={'100%'}
      sx={{ position: 'relative', backgroundColor: 'white' }}
    >
      {preRenderedPosts || (posts && posts.length > 0) ? (
        // Сама таблица
        <DataGrid
          isRowSelectable={(params) => false}
          hideFooterSelectedRowCount
          disableColumnMenu={true}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 15]}
          sx={{
            border: 'none',
            '& .MuiDataGrid-iconSeparator': {
              display: 'none',
            },
            '& .MuiDataGrid-row': {
              marginBottom: '24px',
            },

            '& .MuiDataGrid-row, & .MuiDataGrid-row:hover': {
              borderRadius: '20px',
              backgroundColor: '#9649FC',
            },
            '& .MuiDataGrid-cell': {
              border: 'none',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'transparent',
              marginBottom: '24px',
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: 'transparent',
              marginTop: '24px',
            },
          }}
          rowHeight={261}
          // preRenderedPosts те самые два поста. Тут мы просто соединяем их
          // с созданными вручную и передаём в таблицу. Таким образом мы разделяем тестовые посты от настоящих.
          rows={[...new Set(preRenderedPosts.concat(posts))]}
          columns={columns}
          initialState={{
            sorting: {
              sortModel: [{ field: 'time', sort: 'desc' }],
            },
          }}
        />
      ) : (
        <Typography>Поки що немає жодного посту...</Typography>
      )}
    </Box>
  );
};
