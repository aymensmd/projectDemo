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
import MessageComponent from './views/MessageComponent';
import SettingsPage from './views/SettingsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/app',
        element: (
          <PrivateRoute allowedRoles={['admin', 'user']}>
            <App />
           
          </PrivateRoute>
        )
      },
      {
        path: '/users_setting',
        element: <UserSettingView />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/profile',
        element: <ProfilePage />
      },
      {
        path: '/dash/chat',
        element: <MessageComponent />
      },
      {
        path: '/settings',
        element: <SettingsPage />
      },
      
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />
  },
  
  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;