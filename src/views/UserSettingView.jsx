import React, { useState } from 'react';
import { Layout, Breadcrumb, Menu, theme } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Drawer, Flex, Typography } from 'antd';
import Form from '../Form/index';
import UserTable from './UserTable';

const { Header, Content } = Layout;

export default function UserSettingView() {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const {
    token: {  borderRadiusLG },
  } = theme.useToken();

  
  const items = [
    { key: '1', label: 'gestion des employés' },
    { key: '2', label: 'gestion des absences' },
    { key: '3', label: 'gestion de congés ' },
    { key: '4', label: 'Contact' },
  ];

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ flex: 1, minWidth: 0 }}
        >
          {items.map(item => (
            <Menu.Item key={item.key}>{item.label}</Menu.Item>
          ))}
        </Menu>
      </Header>
      <Content style={{ padding: '0 48px' }}>
      
        <div
          style={{
           
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <Flex gap="large">
            <Card style={{ padding: '20px', maxHeight: '200px' }}>
              <Flex vertical gap="20px">
                <Flex vertical align="flex-start">
                  <Typography.Title level={3} strong>
                    Gestion des comptes
                  </Typography.Title>
                  <Typography.Text type="secondary" strong>
                    creation & modification des comptes
                  </Typography.Text>
                </Flex>
                <Flex gap="1rem">
                  <Button type="primary" size="large" onClick={showDrawer}>
                    <PlusOutlined />
                    Ajouter
                  </Button>
                </Flex>
              </Flex>
            </Card>

            <Flex>
              <UserTable />
            </Flex>
          </Flex>

          <Drawer
            title="Faire une demande de congé"
            placement="right"
            onClose={closeDrawer}
            visible={drawerVisible}
            size="large"
          >
            {/* Content of the drawer */}
            <Form />
          </Drawer>
        </div>
      </Content>
  
    </Layout>
  );
}
