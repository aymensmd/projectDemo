import React from 'react'

import  { useState } from 'react';
import Layout from 'antd/es/layout/layout';

import {  Flex } from 'antd';


import MainContent from '../pages/MainContent';
import SideContent from '../pages/SideContent';

const { Sider, Header, Content } = Layout;


export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
    
        <>
        <Content className="content">
              <Flex gap='large'>
                {/* Add your authenticated content here */}
                <MainContent />
                <SideContent />
              </Flex>
            </Content>
         
        </>
 
    </Layout>
  )
}
