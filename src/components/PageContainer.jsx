import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const PageContainer = ({ title, children, style, extra }) => {
  return (
    <div style={{ padding: 24 }}>
      {title && <Title level={2} style={{ marginBottom: 12 }}>{title}</Title>}
      <Card style={{ marginTop: 8, ...style }} extra={extra}>
        {children}
      </Card>
    </div>
  );
};

export default PageContainer;
