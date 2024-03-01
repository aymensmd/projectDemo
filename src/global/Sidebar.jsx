import React, { useState } from 'react';
import { WindowsOutlined, ProfileOutlined, FormOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import { Flex, Menu } from 'antd';

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem('Dashboard', 'dashboard1', <WindowsOutlined />),
  getItem('Messages', 'HR member', <MessageOutlined />, [
    getItem('Team', 'g1', null, [getItem('Developers', '1'), getItem('Marketing team', '2')], 'group'),
   
  ]),
  getItem('Navigation ', 'sub2', <ProfileOutlined />, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
  ]),
  getItem('Condidature', 'Condidature', <FormOutlined />),
  {
    type: 'divider',
  },
  getItem('Navigation Three', 'sub4', <SettingOutlined />, [
    getItem('Setting', '9'),
    getItem('Log Out', '10'),
  ]),
];

function Sidebar({ onSelectMenuItem }) {
  const [current, setCurrent] = useState('1');

  const handleMenuClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);

    // Pass the selected menu item to the parent component
    onSelectMenuItem(e.key);
  };

  return (
    <>
      <Flex align='center' justify='center'>
        <div className="logo"></div>
      </Flex>
      <Menu
        onClick={handleMenuClick}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        items={items}
      />
    </>
  );
}

export default Sidebar;
