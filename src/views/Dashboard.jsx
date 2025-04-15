import React from 'react';
import { useState } from 'react';
import Layout from 'antd/es/layout/layout';
import { Row, Col } from 'antd';
import MainContent from '../pages/MainContent';
import SideContent from '../pages/SideContent';

const { Content } = Layout;

export default function Dashboard() {
  return (
    <Layout>
      <Content className="content" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Row gutter={[16, 16]} style={{ margin: '0 auto', maxWidth: '1200px' }}>
          <Col xs={24} md={16}>
            <MainContent />
          </Col>
          <Col xs={24} md={8}>
            <SideContent />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
