import { MessageOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Flex } from 'antd'
import Search from 'antd/es/input/Search'
import Typography from 'antd/es/typography/Typography'
import React from 'react'
import comunikcrm from '../assets/comunikcrm.png'

const CostumHeader = () => {
  return (
    <Flex align='center' justify='space-between'>
      <Typography.Title level={2} type='secondary'>
      <img src={comunikcrm} width="150" /></Typography.Title>
        <Flex align='center' gap='3rem'>
          <Search placeholder='Search Dashbord' allowClear/>
          <Flex align='center' gap='10px'>
            <MessageOutlined className='header-icon'/>
            <NotificationOutlined  className='header-icon'/>
            <Avatar icon={<UserOutlined/>} />

          </Flex>
        </Flex>
    </Flex>
  )
}

export default CostumHeader