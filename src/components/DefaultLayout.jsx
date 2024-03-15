import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { Layout } from 'antd';
import { useStateContext } from '../contexts/ContextProvider'



export default function DefaultLayout() {
  const {  token } = useStateContext()

  if (!token) {
    return <Navigate to='/login' />
  }

  return (
    <Layout>
     
      
            <Outlet />
     
        
    </Layout>
  );
}
