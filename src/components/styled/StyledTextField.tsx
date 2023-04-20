import styled from '@emotion/styled';
import { TextField } from '@mui/material';

const AppTextField = styled(TextField)({
  ':not(.imageInput)& label': {
    color: 'white',
  },

  '&.titleInput label': {
    fontSize: '1.2rem',
  },

  ':not(.imageInput)& label.Mui-focused': {
    color: 'yellow',
  },

  '& .MuiInputBase-root': {
    color: 'white',
  },

  '& .MuiInputBase-root.MuiFilledInput-root': {
    color: 'black',
    backgroundColor: 'white',
  },

  '& .MuiInputBase-multiline .MuiOutlinedInput-notchedOutline': {
    borderColor: 'white',
    borderWidth: '1px',
  },
  '& .MuiInputBase-multiline.Mui-focused': {
    backgroundColor: '#9028ff',
  },
  '& .MuiInputBase-multiline.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'yellow',
    borderWidth: '2px',
  },
  '& .MuiInputBase-multiline:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'yellow',
    borderWidth: '2px',
  },

  '& .MuiInput-underline:hover:before': {
    borderBottom: `2px solid yellow !important`,
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: 'white',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'yellow',
  },
});

export default AppTextField;
