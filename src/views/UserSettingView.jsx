import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import EmployeViewComponent from './EmployeViewComponent';
import UserTable from './UserTable';

import { Outlet } from 'react-router-dom';

const { Header } = Layout;

function UserSettingView({ onSelectMenuItem }) {
  const [current, setCurrent] = useState('1');

  const handleMenuClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  const renderContent = (key) => {
    switch (key) {
      case '1':
        return <EmployeViewComponent />;
      case '2':
        return "todo";
      case '3':
        return <EmployeViewComponent />;
      case '4':
        return <EmployeViewComponent />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          onClick={handleMenuClick}
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          selectedKeys={[current]}
          style={{ flex: 1, minWidth: 0 }}
        >
          <Menu.Item key="1" >
            Gestion des comptes
          </Menu.Item>
          <Menu.Item key="2">Gestion des absences</Menu.Item>
          <Menu.Item key="3">Gestion de congés</Menu.Item>
          <Menu.Item key="4">Contact</Menu.Item>
        </Menu>
      </Header>
      <Outlet />
      {renderContent(current)}
    </Layout>
  );
}

export default UserSettingView;
