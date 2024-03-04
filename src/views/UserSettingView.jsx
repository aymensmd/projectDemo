import React, { useState } from 'react'
import Layout from 'antd/es/layout/layout';
import {PlusOutlined} from '@ant-design/icons'
import { Button, Card, Drawer, Flex, Typography } from 'antd';
import Form from "../Form/index"
const {Content} = Layout
export default function UserSettingView() {
  const [someBooleanValue, setDrawerVisible] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };
  return (
    <>
      <Content className="content">
              <Flex gap='large'>
              <Card style={{ height: 250, padding: '20px', width: 500 }}>
        <Flex vertical gap='20px'>
          <Flex vertical align="flex-start">
            <Typography.Title level={3} strong>
              Gestion des comptes
            </Typography.Title>
            <Typography.Text type="secondary" strong>
              creation & modifiction des compt
            </Typography.Text>
          </Flex>
          <Flex gap="1rem">
            <Button type='primary' size='large' onClick={showDrawer} >
            <PlusOutlined />
              Ajouter
            </Button>
            
            <Button size='large'>Modifier</Button>
            <Button danger size='large'>Supprimer</Button>
          </Flex>
        </Flex>
      </Card>
      <Card   style={{ height: 250, padding: '20px', width: 500 }}>other content</Card>
              </Flex>

              <Drawer
        title="Faire une demande de congé"
        placement="right"
        onClose={closeDrawer}
        open={someBooleanValue}
        size='large'
       
      >
        {/* Content of the drawer */}
        <Form />
      </Drawer>
            </Content>
    </>
  )
}
