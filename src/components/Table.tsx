import TelegramIcon from '@mui/icons-material/Telegram';
import FacebookIcon from '@mui/icons-material/Facebook';
import { SavedPost } from '../pages/Root';
import { Box, Typography } from '@mui/material';
import { useLocalStorage } from '../helpers';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

export default function Table() {
  const [posts] = useLocalStorage();

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
      headerName: 'AUTHOR',
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
      headerName: 'TITLE',
      flex: 2,
    },
    {
      field: 'imageUrl',
      headerName: 'IMAGE',
      flex: 3,
      renderCell: ({ row }: GridRenderCellParams<SavedPost>) => {
        const { imageUrl } = row;

        return (
          <Box p={1} height={'200px'} display='flex' justifyContent='center'>
            <img src={imageUrl} alt='post' />
          </Box>
        );
      },
    },
    {
      field: 'time',
      headerName: 'DATE',
      flex: 1,
    },
    {
      field: 'publishedTo',
      headerName: 'PUBLISHED',
      flex: 2,
      renderCell: ({ row }: GridRenderCellParams<SavedPost>) => {
        const {
          publishedTo: { isPublishedToFB, isPublishedToTG },
        } = row;

        return (
          <Box display='flex' justifyContent='center'>
            {isPublishedToTG && (
              <Box display={'flex'} gap={1} alignItems={'flex-end'}>
                <TelegramIcon color='primary' />
                <Typography color='primary' variant='subtitle2'>
                  Telegram
                </Typography>
              </Box>
            )}
            {isPublishedToFB && (
              <Box display={'flex'} gap={1} alignItems={'flex-end'}>
                <FacebookIcon color='primary' />
                <Typography color='primary' variant='subtitle2'>
                  Facebook
                </Typography>
              </Box>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <Box width={'100%'} height={'80vh'}>
      {posts && posts.length > 0 ? (
        <DataGrid
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
          rows={posts}
          columns={columns}
        />
      ) : (
        <Typography>No posts :c</Typography>
      )}
    </Box>
  );
}
