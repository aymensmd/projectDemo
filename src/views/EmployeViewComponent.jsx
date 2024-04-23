import React , { useState } from 'react'
import { Button, Card, Drawer, Flex, Typography } from 'antd';
import {PlusOutlined} from '@ant-design/icons'
import Layout from 'antd/es/layout/layout';
import Form from "../Form/index"
import UserTable from './UserTable'
const {Content} = Layout
const EmployeViewComponent = () => {
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
              <Flex gap='large' >
                <Flex >
                    <Content>
              <Card style={{ height: 250, padding: '20px', width: 350 }}>
        <Flex vertical gap='20px'>
          <Flex vertical align="flex-start">
            <Typography.Title level={5} strong>
              Gestion des comptes
            </Typography.Title>
            <Typography.Text type="secondary" strong>
              creation & modifiction des compte
            </Typography.Text>
          </Flex>
          <Flex gap="1rem">
            <Button type='primary' size='large' onClick={showDrawer} >
            <PlusOutlined size='small' />
              Ajouter
            </Button>
            
            
          </Flex>
        </Flex>
      </Card>
      <Card style={{ height: 250, padding: '20px', width: 350 }}>
        <Flex vertical gap='20px'>
          <Flex vertical align="flex-start">
            <Typography.Title level={3} strong>
              Todo
            </Typography.Title>
          
          </Flex>
          <Flex gap="1rem">
            <Button type='primary' size='large' onClick={showDrawer} >
            <PlusOutlined />
              todo
            </Button>
            
            
          </Flex>
        </Flex>
      </Card>
      <Card style={{ height: 250, padding: '20px', width: 350 }}>
        <Flex vertical gap='20px'>
          <Flex vertical align="flex-start">
            <Typography.Title level={5} strong>
              Somthing here
            </Typography.Title>
            <Card>
              chart here
            </Card>
           
          </Flex>
          <Flex gap="1rem">
           
            
           
          </Flex>
        </Flex>
      </Card>
      </Content>
      </Flex>
      
      
      <Flex >
                    <Card style={{ padding: '20px', flex: 1 }}>
                        <UserTable />
                    </Card>
                </Flex>
              </Flex>
             

              <Drawer
        title="Faire une demande de congé"
        placement="right"
        onClose={closeDrawer}
        open={someBooleanValue}
        width={1000}
       
      >
        {/* Content of the drawer */}
        <Form />
      </Drawer>
            </Content>
    </>
  )
}

export default EmployeViewComponent