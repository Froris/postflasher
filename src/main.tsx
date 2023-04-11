import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import Main from './pages/Main';
import { Login } from './pages/Login';
import { Root } from './pages/Root';
import { CreatePost } from './pages/CreatePost';

const router = createHashRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        path: '/',
        element: <Main />,
      },
      {
        path: '/login',

        element: <Login />,
      },
      {
        path: '/create',
        element: <CreatePost />,
      },
    ],
  },
]);

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
