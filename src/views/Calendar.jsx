import React from 'react';
import { Typography } from 'antd';
const { Title, Paragraph } = Typography;

const Calendar = () => (
  <div style={{ padding: 32 }}>
    <Title level={2}>Calendar</Title>
    <Paragraph>View and manage your events, meetings, and deadlines.</Paragraph>
  </div>
);
export default Calendar;
