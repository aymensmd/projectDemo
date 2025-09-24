import React from 'react';
import { Typography } from 'antd';
const { Title, Paragraph } = Typography;

const TimeTracking = () => (
  <div style={{ padding: 32 }}>
    <Title level={2}>Time Tracking</Title>
    <Paragraph>Log and monitor your work hours and attendance here.</Paragraph>
  </div>
);
export default TimeTracking;
