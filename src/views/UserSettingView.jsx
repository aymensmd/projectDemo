import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, TeamOutlined, CalendarOutlined, TableOutlined } from '@ant-design/icons';
import EmployeViewComponent from './EmployeViewComponent';
import UserTable from './UserTable';
import EventsComponent from './EventsComponent';

import { Outlet } from 'react-router-dom';
import VacationComponent from './VacationComponent';

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
        return <VacationComponent />;
      case '3':
        return <EventsComponent />;
      default:
        return null;
    }
  };

  return (
    <Layout style={{ background: '#f4f8fb', minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', background: '#277dfe', boxShadow: '0 2px 8px #e6f0ff', borderRadius: '0 0 12px 12px', marginBottom: 16 }}>
        <div className="demo-logo" />
        <Menu
          onClick={handleMenuClick}
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          selectedKeys={[current]}
          style={{ flex: 1, minWidth: 0, background: 'transparent', fontWeight: 600, fontSize: 16, border: 'none' }}
          items={[
            {
              key: '1',
              icon: <TeamOutlined style={{ fontSize: 18, color: '#fff' }} />,
              label: <span style={{ color: '#fff' }}>Gestion des comptes</span>,
            },
            {
              key: '2',
              icon: <CalendarOutlined style={{ fontSize: 18, color: '#fff' }} />,
              label: <span style={{ color: '#fff' }}>Gestion des absences</span>,
            },
            {
              key: '3',
              icon: <TableOutlined style={{ fontSize: 18, color: '#fff' }} />,
              label: <span style={{ color: '#fff' }}>Events</span>,
            },
          ]}
        />
      </Header>
      <div style={{ padding: 24, background: 'transparent', minHeight: 400 }}>
        <Outlet />
        {renderContent(current)}
      </div>
    </Layout>
  );
}

export default UserSettingView;
