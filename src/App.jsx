import React, { useState } from 'react';
import Layout from 'antd/es/layout/layout';
import { Button, Flex, Card } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import CustomHeader from './global/CustomHeader';
import Sidebar from './global/Sidebar';
import './app.css'; // Import your custom styles

const { Sider, Header, Content } = Layout;
import Dashboard from './views/Dashboard'
import UserSettingView from './views/UserSettingView';







const App = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState('users_setting');



  const renderContent = () => {
  switch (selectedMenuItem) {
      case 'dashboard':
        return <Dashboard/>;
      // Add more cases for other menu items
      case 'Condidature':
        return <UserSettingView />;
      case 'Messages':
        return 'todo';
      case 'users_setting':
        return <UserSettingView />;
      default:
        return null;
    } 
    
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <>
        <Sider
          theme="light"
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="sider"
        >
          <Sidebar onSelectMenuItem={setSelectedMenuItem} />
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="triger-btn"
          />
        </Sider>
        <Layout>
          <Header className="header">
            <CustomHeader />
          </Header>
          <Content className="content">
            
            {renderContent()}
          </Content>
        </Layout>
      </>
    </Layout>
  );
};

export default App;
