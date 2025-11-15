import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Button, Layout, ConfigProvider } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Sidebar from '../global/Sidebar';
import CustomHeader from '../global/CustomHeader';
import '../app.css';
import { theme as antdTheme } from 'antd';
import { useStateContext } from '../contexts/ContextProvider';
import crm from '../assets/crm.png';
const { Sider, Content } = Layout;

export default function DefaultLayout() {
  const [collapsed, setCollapsed] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState('users_setting');
  const { theme } = useStateContext();
  const siderWidth = collapsed ? 80 : 200;

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      <Layout 
        style={{ minHeight: '100vh' }}
        className={theme === 'dark' ? 'dark-theme' : ''}
      >
        <Sider
          theme={theme === 'dark' ? 'dark' : 'light'}
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="sider"
          style={{
            position: 'fixed',
            left: 0,
           
            bottom: 0,
            height: '100vh',
            overflow: 'auto',
            zIndex: 1000,
          }}
        >
       
          <Button
            type="primary"
            size="large"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="trigger-btn sidebar-top-trigger"
            style={{
              position: 'absolute',
              top: 18,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1100,
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              background: theme === 'dark' ? '#141414' : '#fff',
              color: theme === 'dark' ? '#fff' : '#222',
              border: '2px dashed #d9d9d9',
              borderRadius: 8,
              transition: 'background 0.2s, color 0.2s',
              width: 36,
              height: 36,
              minWidth: 36,
              minHeight: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              fontSize: 16,
            }}
          />
          <Sidebar onSelectMenuItem={setSelectedMenuItem} />
        </Sider>
        <Layout style={{ marginLeft: siderWidth, transition: 'margin-left 0.18s' }}>
          <CustomHeader />
          <Content 
            style={{ 
              margin: '0 1px', 
              padding: 4, 
              background: theme === 'dark' ? '#141414' : '#fff', 
              minHeight: 280 
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}