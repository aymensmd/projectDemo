import React, { useState, useEffect } from 'react';
import {
  HomeOutlined,
  WindowsOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  SettingOutlined,
  MessageOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Menu, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const Sidebar = () => {
  const { user, logout } = useStateContext();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const [current, setCurrent] = useState(location.pathname);

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleMenuClick = (e) => {
    setCurrent(e.key);
    if (e.key === 'logout') {
      handleLogout();
    } else {
      navigate(e.key);
    }
  };

  const buildMenuItems = () => {
    const items = [
      getItem('Home', '/welcome', <HomeOutlined />),
      getItem('Dashboard', '/dashboard', <WindowsOutlined />),
      getItem('Profile', '/profile', <UserOutlined />),
      getItem('Settings', '/settings', <SettingOutlined />),
    ];

    if (user?.role?.name?.toLowerCase() === 'admin') {
      items.push(
        getItem('HR Management', 'hr', <UsergroupAddOutlined />, [
          getItem('Employee Profiles', '/users_setting', <UserOutlined />),
          getItem('Leave Management', '/leaves', <UserOutlined />),
        ])
      );
    }

    items.push(
      getItem('Chat', '/dash/chat', <MessageOutlined />),
      getItem('Logout', 'logout', loggingOut ? <Spin size="small" /> : <LogoutOutlined />)
    );

    return items;
  };

  return (
    <Menu
      onClick={handleMenuClick}
      selectedKeys={[current]}
      mode="inline"
      items={buildMenuItems()}
      style={{
        height: '100%',
        overflowY: 'auto',
        maxWidth: '100%',
        padding: '8px',
        position: 'absolute',
        top: 80,
        left: 0,
        bottom: 0,
      }}
      className="responsive-sidebar"
    />
  );
};

export default Sidebar;