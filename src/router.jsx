import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "./views/Login";
import SignUp from "./views/SignUp";
import NotFound from "./views/NotFound";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Dashboard from "./views/Dashboard";
import React from "react";
import  App  from "./App";
const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
    
    
      { 
        path: 'dashboard1',
        element: <Dashboard />,
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
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
    ],
  },

  {
    path: '*',
    element: <NotFound />,
  },
  {
    path: "users",
    element: <App />,
  },

]);

export default router;
