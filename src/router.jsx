import { createBrowserRouter } from 'react-router-dom';
import Login from './views/Login';

import NotFound from './views/NotFound';
import DefaultLayout from './components/DefaultLayout';

import React from 'react';
import App from './App';
import EmployeViewComponent from './views/EmployeViewComponent';
import Dashboard from './views/Dashboard';
import UserSettingView from './views/UserSettingView';
import Unauthorized from './views/Unauthorized';
import PrivateRoute from './contexts/PrivateRoute';
import ProfilePage from './views/ProfilePage';

const router = createBrowserRouter([
  {
    index: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: 'app',
        element: <App />,
        hasChild: true,
        allowedRoles: ['admin', 'user'], // Example of allowed roles
      },
      {
        path: 'users_setting',
        element: <UserSettingView />,
      },
      {
        path: 'profile',
        element: <ProfilePage />, // Add the ProfilePage component as the route element
      },
    ],
  },

  {
    path: 'login',
    element: <Login />,
  },  
  
  {
    path: '*',
    element: <NotFound />,
  },
  {
    path: 'unauthorized',
    element: <Unauthorized />,
  },
  {
    path: '/dash',
    element: <App />,
    children: [
      {
        path: '/dash/chat',
        element: <EmployeViewComponent />,
      },
    ],
  },
  
  
]);


export default router;
