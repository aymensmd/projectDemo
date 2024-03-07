import { Button, Card, Drawer, Flex, Typography } from 'antd';
import React, { useState } from 'react';

const Banner = () => {
  const [someBooleanValue, setDrawerVisible] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <>
      <Card style={{ height: 260, padding: '20px' }}>
        <Flex vertical gap='30px'>
          <Flex vertical align="flex-start">
            <Typography.Title level={2} strong>
              something here
            </Typography.Title>
            <Typography.Text type="secondary" strong>
              some actioné
            </Typography.Text>
          </Flex>
          <Flex gap="1rem">
            <Button type='primary' size='large' onClick={showDrawer}>
              Demande
            </Button>
            
            <Button size='large'>Consulter ou modifier votre demande </Button>
          </Flex>
        </Flex>
      </Card>

      <Drawer
        title="Faire une demande de congé"
        placement="right"
        onClose={closeDrawer}
        open={someBooleanValue}
       
      >
        {/* Content of the drawer */}
        
      </Drawer>
      <Card style={{ height: 325, padding: '20px' }}>
        
      </Card>
    </>
  );
};

export default Banner;
