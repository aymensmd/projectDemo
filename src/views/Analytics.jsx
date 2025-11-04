import React from 'react';
import { Typography, Row, Col, Card, Statistic, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, TeamOutlined, ProjectOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Analytics = () => (
  <div style={{ padding: 24 }}>
    <Title level={2}>Analytics</Title>
    <p>Visualize and analyze your HR and business data here.</p>

    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Active Employees"
            value={128}
            prefix={<TeamOutlined />}
            valueStyle={{ color: '#3f8600' }}
            suffix={<ArrowUpOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Open Projects"
            value={14}
            prefix={<ProjectOutlined />}
            valueStyle={{ color: '#cf1322' }}
            suffix={<ArrowDownOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Avg. Task Completion"
            value={82}
            suffix="%"
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Satisfaction"
            value={4.3}
            suffix="/5"
          />
        </Card>
      </Col>
    </Row>

    <Card style={{ marginTop: 16 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
          (Placeholder for charts) — integrate a charting library (Recharts / Chart.js / ApexCharts)
        </div>
      </Space>
    </Card>
  </div>
);

export default Analytics;
