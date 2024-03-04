import React from 'react'

import  { useState } from 'react';
import Layout from 'antd/es/layout/layout';

import {  Flex } from 'antd';


import MainContent from '../pages/MainContent';
import SideContent from '../pages/SideContent';

const { Content } = Layout;


export default function Dashboard() {
  

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
