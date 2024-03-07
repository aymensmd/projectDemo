  import React, { useState } from 'react';
  import Layout from 'antd/es/layout/layout';
  import { Button, Flex, Card } from 'antd';
  import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
  import CustomHeader from './global/CustomHeader';
  import Sidebar from './global/Sidebar';
  import './app.css'; 
  const { Sider, Header, Content } = Layout;
  import Dashbboard from './views/Dashboard'
  import UserSettingView from './views/UserSettingView';

  const DashboardContent = () => (
    <div>
      <Dashbboard />
    </div>
  );
  const UserSetting = () => (
    <div>
      <UserSettingView />
    </div>
  );

  const MessagesContent = () => (
    <div>
      <Card >
  condidature table here
      </Card>
    </div>
  );

  const App = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [selectedMenuItem, setSelectedMenuItem] = useState('dashboard1');

    const renderContent = () => {
      switch (selectedMenuItem) {
        case 'dashboard1':
          return <DashboardContent />;
        // Add more cases for other menu items
        case 'Condidature':
          return <MessagesContent />;
        case 'Messages':
          return <MessagesContent />;
        case 'users_setting':
          return <UserSetting />;
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
