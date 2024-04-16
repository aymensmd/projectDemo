import { createBrowserRouter } from "react-router-dom";
import Login from "./views/Login";
import SignUp from "./views/SignUp";
import NotFound from "./views/NotFound";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";

import React from "react";
import  App  from "./App";

  
const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
    
      { 
        path: 'app',
        element: <App />,
      },
      

    ],
  },
  {
    index: '/',
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

  // to delete
  {
    path: '/dash',
    element: <App />,
  },
  
 
  

]);

export default router;
