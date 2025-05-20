import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './views/Login';
import NotFound from './views/NotFound';
import DefaultLayout from './components/DefaultLayout';
import App from './App';
import Dashboard from './views/Dashboard';
import UserSettingView from './views/UserSettingView';
import Unauthorized from './views/Unauthorized';
import PrivateRoute from './contexts/PrivateRoute';
import ProfilePage from './views/ProfilePage';
import MessageComponent from './views/MessageComponent';
import SettingsPage from './views/SettingsPage';
import WelcomePage from './views/WelcomePage'; // Import WelcomePage
import React from 'react';
const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <DefaultLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/welcome" replace /> // Redirect root to welcome
      },
      {
        path: '/welcome',
        element: <WelcomePage /> // New welcome route
      },
      {
        path: '/app',
        element: <App />,
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
        path: '/settings',
        element: <SettingsPage />
      },
      {
        path: '/dash/chat',
        element: <MessageComponent />
      },
      // HR Management routes - only visible to admin
      {
        path: '/users_setting',
        element: (
          <PrivateRoute allowedRoles={['admin']}>
            <UserSettingView />
          </PrivateRoute>
        )
      },
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;