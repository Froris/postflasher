import styled from '@emotion/styled';
import { Button } from '@mui/material';

const AppButton = styled(Button)({
  '&.MuiButton-text.MainButton': {
    color: 'white',
  },
  '&.MuiButton-text.MainButton:hover': {
    color: 'yellow',
    backgroundColor: '#573472',
  },

  '&.MuiButton-outlined.FormButton-back': {
    border: '1px solid white',
    color: 'white',
  },
  '&.MuiButton-outlined.FormButton-back:hover': {
    border: '1px solid yellow',
    color: 'yellow',
  },

  '&.MainButton-add': {
    backgroundColor: '#A54BFF',
    color: 'white',
  },
  '&.MainButton-add:hover': {
    color: 'white',
    backgroundColor: '#573472',
  },

  '&.MainButton-clearStorage': {
    border: '1px solid #A54BFF',
    color: '#A54BFF',
  },
  '&.MainButton-clearStorage:hover': {
    backgroundColor: '#573472',
    border: '1px solid yellow',
    color: 'yellow',
  },

  '&.FormButton-create, &.FormButton-logIn, &.FormButton-delete': {
    backgroundColor: 'white',
    color: '#A54BFF',
  },
  '&.FormButton-create:hover, &.FormButton-logIn:hover, &.FormButton-delete:hover':
    {
      backgroundColor: '#e8d4fc',
    },
});

export default AppButton;
