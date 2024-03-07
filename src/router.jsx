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
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/dashboard',
        element: <App />,
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
    path: "users",
    element: <App />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
  {
    path: "users",
    element: <App />,
  },
  
  { 
    path: 'dashboard1',
    element: <Dashboard />,
  },
]);

export default router;
