import React, { useState } from 'react';
import { WindowsOutlined, UsergroupAddOutlined, ProfileOutlined, FormOutlined, MessageOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
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

const Sidebar = ({ onSelectMenuItem }) => {
  const { user, setToken } = useStateContext();
  const [current, setCurrent] = useState('1');
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoggingOut(true);
    // Clear user session data
    setToken(null);
    setCurrent(null);
    setLoggingOut(false);
    // Redirect to login page
    navigate('/login');
  };

  const handleMenuClick = (e) => {
    setCurrent(e.key);
    if (e.key === 'logout') {
      handleLogout();
    } else {
      navigate(e.key);
      onSelectMenuItem(e.key);
    }
  };

  const items = [
    getItem('Dashboard', 'app', <WindowsOutlined />),
    { type: 'divider', style: { backgroundColor: '#d9d9d9' } }, // Darkened the divider line for better visibility
    getItem('Profile', 'profile', <UserOutlined />),
    getItem('Settings', 'settings', <SettingOutlined />),
   
    user && user.role.name === 'admin' && getItem('Ressources humains', 'HRmember', <UsergroupAddOutlined />, [
      getItem('Gestion des employés', 'group', null, [
        getItem('Gestion des profiles', 'users_setting', <UserOutlined />),
        getItem('Gestion des congés', '2'),
      ], 'group'),
    ]),
  
    getItem('logout', 'logout', loggingOut ? <Spin /> : <LogoutOutlined />),
  ].filter(Boolean); // This will filter out any false values

  return (
    <Menu
      onClick={handleMenuClick}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
      style={{
        height: '100%', // Adjust to the full page height dynamically
        overflowY: 'auto',
        maxWidth: '100%',
        padding: '8px',
        position: 'absolute', // Use absolute positioning
        top: 80, // Align to the top of the page
        left: 0, // Align to the left of the page
        bottom: 0, // Ensure it stretches to the bottom
      }}
      className="responsive-sidebar"
    />
  );
};

export default Sidebar;
