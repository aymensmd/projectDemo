import React, { useState } from 'react';
import Layout from 'antd/es/layout/layout';
import { Button, Flex, Card } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import CustomHeader from './global/CustomHeader';
import Sidebar from './global/Sidebar';
import './app.css'; // Import your custom styles
import MessageComponent from './views/MessageComponent'
const { Sider, Header, Content } = Layout;
import Dashboard from './views/Dashboard'
import UserSettingView from './views/UserSettingView';
import { Outlet, Navigate } from 'react-router-dom';



const App = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState('users_setting');




  return (
    <Layout style={{ minHeight: '100vh' }}>
      <>
        
        <Dashboard/>
      </>
    </Layout>
  );
};

export default App;
