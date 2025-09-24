import React from 'react';
import { Typography } from 'antd';
const { Title, Paragraph } = Typography;

const Notifications = () => (
  <div style={{ padding: 32 }}>
    <Title level={2}>Notifications</Title>
    <Paragraph>All your system and HR notifications will appear here.</Paragraph>
  </div>
);
export default Notifications;
