import React from 'react';
import { Typography } from 'antd';
const { Title, Paragraph } = Typography;

const KnowledgeBase = () => (
  <div style={{ padding: 32 }}>
    <Title level={2}>Knowledge Base</Title>
    <Paragraph>Browse articles, guides, and documentation here.</Paragraph>
  </div>
);
export default KnowledgeBase;
