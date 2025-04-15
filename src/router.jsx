<<<<<<< HEAD
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
=======
import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "./views/Login";
import SignUp from "./views/SignUp";
import Users from "./views/Users";
import NotFound from "./views/NotFound";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Dashboard from "./views/Dashboard";
import React from "react";
import  App  from "./App";
const router = createBrowserRouter([  
>>>>>>> 66757f1ec900002ab150887e622332506504d1ea
  {
    index: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: 'app',
        element: <App />,
<<<<<<< HEAD
        hasChild: true,
        allowedRoles: ['admin', 'user'], // Example of allowed roles
=======
      },
    
     
    ],
  },
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
>>>>>>> 66757f1ec900002ab150887e622332506504d1ea
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
<<<<<<< HEAD
    path: 'unauthorized',
    element: <Unauthorized />,
=======
    path: "users",
    element: <App />,
  },
  
  { 
    path: 'dashboard1',
    element: <Dashboard />,
>>>>>>> 66757f1ec900002ab150887e622332506504d1ea
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
