import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../global/Sidebar';
import CustomHeader from '../global/CustomHeader';
import { Layout, Flex } from 'antd';
import { useStateContext } from '../contexts/ContextProvider'
const { Sider, Header, Content } = Layout;
 


export default function DefaultLayout() {
  const { user, token } = useStateContext()

  if (!token) {
    return <Navigate to='/login' />
  }

  return (
    <Layout>
     
      
            <Outlet />
     
        
    </Layout>
  );
}
