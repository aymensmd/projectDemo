import React, { useState } from 'react';
import { Layout, Menu, Drawer, Button, theme } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  CalendarOutlined, 
  TableOutlined,
  MenuOutlined,
  CloseOutlined
} from '@ant-design/icons';
import EmployeViewComponent from './EmployeViewComponent';
import UserTable from './UserTable';
import EventsComponent from './EventsComponent';
import { Outlet } from 'react-router-dom';
import VacationComponent from './VacationComponent';

const { Header, Content } = Layout;
const { useToken } = theme;

function UserSettingView({ onSelectMenuItem }) {
  const { token } = useToken();
  const [current, setCurrent] = useState('1');
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleMenuClick = (e) => {
    setCurrent(e.key);
    setMobileMenuVisible(false);
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

  const menuItems = [
    {
      key: '1',
      icon: <TeamOutlined style={{ fontSize: 18 }} />,
      label: 'Gestion des comptes',
    },
    {
      key: '2',
      icon: <CalendarOutlined style={{ fontSize: 18 }} />,
      label: 'Gestion des absences',
    },
    {
      key: '3',
      icon: <TableOutlined style={{ fontSize: 18 }} />,
      label: 'Events',
    },
  ];

  return (
    <Layout style={{ 
      background: token.colorBgContainer, 
      minHeight: '100vh',
      transition: 'all 0.2s'
    }}>
      {/* Desktop Header */}
      <Header 
        style={{ 
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center', 
          background: token.colorPrimary, 
          boxShadow: token.boxShadow,
          borderRadius: { xs: 0, md: '0 0 12px 12px' },
          marginBottom: 16,
          padding: '0 24px',
          height: 64,
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <Menu
          onClick={handleMenuClick}
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          selectedKeys={[current]}
          style={{ 
            flex: 1, 
            minWidth: 0, 
            background: 'transparent', 
            fontWeight: 600, 
            fontSize: 16, 
            border: 'none',
            lineHeight: '64px'
          }}
          items={menuItems.map(item => ({
            ...item,
            label: <span style={{ color: token.colorWhite }}>{item.label}</span>
          }))}
        />
      </Header>

      {/* Mobile Header */}
      <Header 
        style={{ 
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: token.colorPrimary, 
          boxShadow: token.boxShadow,
          marginBottom: 16,
          padding: '0 16px',
          height: 56,
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div style={{ color: token.colorWhite, fontWeight: 600, fontSize: 18 }}>
          {menuItems.find(item => item.key === current)?.label}
        </div>
        <Button 
          type="text" 
          icon={mobileMenuVisible ? <CloseOutlined /> : <MenuOutlined />}
          onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
          style={{ color: token.colorWhite, fontSize: 18 }}
        />
      </Header>

      {/* Mobile Menu Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        closable={false}
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ background: token.colorPrimary, color: token.colorWhite }}
      >
        <Menu
          onClick={handleMenuClick}
          theme="light"
          mode="vertical"
          selectedKeys={[current]}
          style={{ 
            borderRight: 0,
            padding: '8px 0'
          }}
          items={menuItems}
        />
      </Drawer>

      {/* Content Area */}
      <Content
        style={{
          padding: '24px',
          margin: 0,
          minHeight: 280,
        }}
      >
        <div style={{
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          padding: 24,
          minHeight: 'calc(100vh - 180px)',
          boxShadow: token.boxShadowSecondary
        }}>
          <Outlet />
          {renderContent(current)}
        </div>
      </Content>
    </Layout>
  );
}

export default UserSettingView;