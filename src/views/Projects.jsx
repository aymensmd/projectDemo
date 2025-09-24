import React, { useState } from 'react';
import { Typography, Row, Col, Card, Button, Tag, Input, List, Avatar, Progress } from 'antd';
import { PlusOutlined, TeamOutlined, CalendarOutlined, CheckCircleOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const initialProjects = [
  {
    id: 1,
    name: 'HR System Upgrade',
    description: 'Upgrade the HR management system to the latest version.',
    status: 'In Progress',
    team: ['Alice', 'Bob'],
    progress: 60,
    due: '2025-10-15',
  },
  {
    id: 2,
    name: 'Onboarding Automation',
    description: 'Automate the onboarding process for new employees.',
    status: 'Completed',
    team: ['Charlie', 'Dana'],
    progress: 100,
    due: '2025-08-30',
  },
  {
    id: 3,
    name: 'Wellness Program',
    description: 'Launch a new employee wellness initiative.',
    status: 'Planned',
    team: ['Eve', 'Frank'],
    progress: 0,
    due: '2025-12-01',
  },
];

const statusColors = {
  'In Progress': 'blue',
  'Completed': 'green',
  'Planned': 'orange',
};

const Projects = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState('');

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: '0 auto' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ marginBottom: 0 }}>Projects</Title>
          <Text type="secondary">Manage and track all your company projects here.</Text>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />}>New Project</Button>
        </Col>
      </Row>
      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Input.Search
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 350 }}
            allowClear
          />
        </Col>
      </Row>
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
        dataSource={filteredProjects}
        renderItem={project => (
          <List.Item>
            <Card
              title={<span>{project.name} <Tag color={statusColors[project.status]}>{project.status}</Tag></span>}
              extra={<Button icon={<EditOutlined />} size="small">Edit</Button>}
              bordered={false}
              style={{ borderRadius: 12, boxShadow: '0 2px 8px #0001', minHeight: 220 }}
            >
              <Paragraph>{project.description}</Paragraph>
              <div style={{ marginBottom: 8 }}>
                <TeamOutlined style={{ marginRight: 6 }} />
                <Text>Team: {project.team.join(', ')}</Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <CalendarOutlined style={{ marginRight: 6 }} />
                <Text>Due: {project.due}</Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <CheckCircleOutlined style={{ marginRight: 6 }} />
                <Text>Progress:</Text>
                <Progress percent={project.progress} size="small" style={{ width: 120, marginLeft: 8, display: 'inline-block' }} />
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Projects;
