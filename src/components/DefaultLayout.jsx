import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Button, Layout } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useStateContext } from '../contexts/ContextProvider';
import Sidebar from '../global/Sidebar';
import CustomHeader from '../global/CustomHeader';
import '../app.css'

const { Sider, Content } = Layout;

export default function DefaultLayout() {
  const { token } = useStateContext();
  const [collapsed, setCollapsed] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState('users_setting');

  if (!token) {
    return <Navigate to="/login" />;

  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="sider"
      >
        <div className="logo" />
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
            background: '#fff',
            color: '#222',
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
      <Layout>
        <CustomHeader />
        <Content style={{ margin: '0 1px', padding: 4, background: '#fff', minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
