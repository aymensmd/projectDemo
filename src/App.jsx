import React, { useState, useEffect } from 'react';
import Layout from 'antd/es/layout/layout';
import { Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import CustomHeader from './global/CustomHeader';
import Sidebar from './global/Sidebar';
import './app.css';
import { Outlet } from 'react-router-dom';
import { useStateContext } from './contexts/ContextProvider';
import { ConfigProvider, theme as antdTheme } from 'antd';

const { Sider, Header, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { theme } = useStateContext();

  // Ensure body class matches theme
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: '100vh' }} className={theme === 'dark' ? 'dark-theme' : ''}>
        <Sider
          theme={theme}
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="sider"
          style={{ background: 'inherit' }}
        >
          <Sidebar />
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="triger-btn"
          />
        </Sider>
        <Layout>
          <Header className="header" style={{ background: 'inherit' }}>
            <CustomHeader />
          </Header>
          <Content className="content" style={{ background: 'inherit' }}>
            <Outlet /> {/* This will render the matched child route */}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;