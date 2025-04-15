import React, { useState, useEffect } from 'react';
import { Badge, Card, Space, Table, Row, List, Button, Drawer, Form, Select, message, Calendar, Statistic, Tag, Typography, Divider, Col, Descriptions } from 'antd';
import { DownCircleTwoTone, UpCircleTwoTone, CalendarTwoTone, UserOutlined, InfoCircleOutlined, MailOutlined, TeamOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Text } = Typography;

const onPanelChange = (value, mode) => {
  console.log(value.format('YYYY-MM-DD'), mode);
};

function LiveClock({ fontSize = 64 }) {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <>
      <span style={{ fontSize, color: '#faad14', fontWeight: 700 }}>
        {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
      <span style={{ fontSize: fontSize / 2, color: '#888', marginTop: 8 }}>{now.toLocaleDateString()}</span>
    </>
  );
}

const TOOL_CONFIG = {
  calendar: {
    icon: <CalendarOutlined style={{ fontSize: 38, color: '#277dfe' }} />,
    content: (
      <Calendar fullscreen={false} onPanelChange={onPanelChange} style={{ borderRadius: 18, minHeight: 180, minWidth: 180, pointerEvents: 'auto', background: '#f0f5ff' }} />
    ),
  },
  watch: {
    icon: <ClockCircleOutlined style={{ fontSize: 38, color: '#faad14' }} />,
    content: <LiveClock fontSize={32} />,
  },
  weather: {
    icon: <span role="img" aria-label="weather" style={{ fontSize: 38, color: '#1890ff' }}>☀️</span>,
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 180 }}>
        <span style={{ fontSize: 48 }}>22°C</span>
        <span style={{ fontSize: 18, color: '#888' }}>Sunny</span>
        <span style={{ fontSize: 14, color: '#888', marginTop: 8 }}>Tunis</span>
      </div>
    ),
  },
  quote: {
    icon: <span role="img" aria-label="quote" style={{ fontSize: 38, color: '#722ed1' }}>💡</span>,
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 180, padding: 12, textAlign: 'center' }}>
        <span style={{ fontSize: 16, fontStyle: 'italic', color: '#722ed1' }}>
          "Success is not the key to happiness. Happiness is the key to success."
        </span>
        <span style={{ fontSize: 13, color: '#888', marginTop: 8 }}>— Albert Schweitzer</span>
      </div>
    ),
  },
};

function ToolBox({ tool, expandedTool, setExpandedTool, onMouseEnter, onMouseLeave }) {
  const isOpen = expandedTool === tool;
  return (
    <div
      style={{
        width: isOpen ? 180 : 90,
        height: isOpen ? 180 : 90,
        borderRadius: 18,
        boxShadow: isOpen ? '0 4px 24px #dbeafe' : '0 1px 4px #e6f0ff',
        background: isOpen ? '#fff' : '#f0f5ff',
        border: isOpen ? '1.5px solid #277dfe' : '1px solid #e6f0ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isOpen ? 'default' : 'pointer',
        position: 'relative',
        transition: 'width 0.5s cubic-bezier(.4,1.8,.6,1), height 0.5s cubic-bezier(.4,1.8,.6,1), box-shadow 0.5s, background 0.5s, border 0.5s, opacity 0.5s',
        zIndex: isOpen ? 2 : 1,
        opacity: isOpen || expandedTool === null ? 1 : 0.3,
        overflow: 'hidden',
        boxSizing: 'border-box',
        minWidth: 0,
        minHeight: 0,
      }}
      onClick={() => !isOpen && setExpandedTool(tool)}
      onMouseEnter={() => onMouseEnter(tool)}
      onMouseLeave={onMouseLeave}
    >
      {isOpen ? (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: 6 }}>
          <div style={{ position: 'absolute', top: 6, right: 8, cursor: 'pointer', fontSize: 16, color: '#888', background: '#f5f7fa', borderRadius: 8, padding: '1px 6px', boxShadow: '0 1px 4px #e6f0ff' }} onClick={e => { e.stopPropagation(); setExpandedTool(null); }}>✕</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', fontSize: 12, padding: 0 }}>
            <div style={{ fontSize: 12, width: '100%', textAlign: 'center' }}>
              {TOOL_CONFIG[tool].content}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          {TOOL_CONFIG[tool].icon}
          <span style={{ fontSize: 13, color: '#888', marginTop: 6, fontWeight: 500, letterSpacing: 0.5, textTransform: 'capitalize' }}>{tool}</span>
        </div>
      )}
    </div>
  );
}

const GlvacationsData = [
  {
    title: 'Fête du Travail',
    startDate: '2022-04-25',
    endDate: '2022-04-28',
    status: "En attente",
  },
  {
    title: 'Aïd el-Fitr',
    startDate: '2022-05-02',
    endDate: '2022-05-05',
    status: "Approuvé",
  },
  {
    title: 'Fête de la République',
    startDate: '2022-05-10',
    endDate: '2022-05-12',
    status: "Approuvé",
  },
];

const VacationComponent = () => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [userData, setUserData] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedVacation, setSelectedVacation] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const [expandedTool, setExpandedTool] = useState(null);

  useEffect(() => {
    fetchUserData();
    const interval = setInterval(fetchUserData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/employees');
      const usersWithVacations = response.data.map(user => ({
        ...user,
        key: user.id,
        vacationRequests: user.vacations,
      }));
      setUserData(usersWithVacations);
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateurs:', error);
    }
  };

  const columns = [
    {
      title: <span style={{ color: '#277dfe', fontWeight: 600 }}>Nom de l'employé</span>,
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (text) => <span style={{ color: '#1890ff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}><UserOutlined /> {text}</span>
    },
    {
      title: <span style={{ color: '#277dfe', fontWeight: 600 }}>Département</span>,
      dataIndex: 'department',
      key: 'department',
      align: 'center',
      render: (text) => <span style={{ color: '#52c41a', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}><InfoCircleOutlined /> {text}</span>
    },
    {
      title: <span style={{ color: '#277dfe', fontWeight: 600 }}>Email</span>,
      dataIndex: 'email',
      key: 'email',
      align: 'center',
      render: (text) => <span style={{ color: '#722ed1', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}><MailOutlined /> {text}</span>
    },
    {
      title: <span style={{ color: '#277dfe', fontWeight: 600 }}>Jour de congé</span>,
      key: 'dayOffRequests',
      align: 'center',
      render: (_, record) => (
        <Space>
          <div onClick={() => toggleExpand(record.key)} style={{ cursor: 'pointer' }}>
            {expandedRowKeys.includes(record.key) ? <DownCircleTwoTone /> : <UpCircleTwoTone />}
          </div>
          <span style={{ color: '#faad14', fontWeight: 600 }}>{record.vacationRequests && record.vacationRequests.length} Demandes de congé</span>
        </Space>
      ),
    },
  ];

  const toggleExpand = (key) => {
    if (expandedRowKeys.includes(key)) {
      setExpandedRowKeys(expandedRowKeys.filter(k => k !== key));
    } else {
      setExpandedRowKeys([...expandedRowKeys, key]);
    }
  };

  const expandedRowRender = (record) => {
    const userVacationData = record.vacationRequests ? record.vacationRequests.map(request => ({
      ...request,
      type: 'Vacances',
    })) : [];
    
    const absenceData = record.absenceRequests ? record.absenceRequests.map(request => ({
      ...request,
      type: 'Absence',
    })) : [];
    
    const dayOffData = [...userVacationData, ...absenceData];
    
    const dayOffColumns = [
      {
        title: <span style={{ color: '#277dfe', fontWeight: 700 }}><CalendarTwoTone /> Date de début</span>,
        dataIndex: 'start_date',
        key: 'start_date',
        align: 'center',
        render: (text) => <span style={{ color: '#1890ff', fontWeight: 500 }}>{text}</span>,
      },
      {
        title: <span style={{ color: '#277dfe', fontWeight: 700 }}><CalendarTwoTone /> Date de fin</span>,
        dataIndex: 'end_date',
        key: 'end_date',
        align: 'center',
        render: (text) => <span style={{ color: '#722ed1', fontWeight: 500 }}>{text}</span>,
      },
      {
        title: <span style={{ color: '#277dfe', fontWeight: 700 }}><InfoCircleOutlined /> Type</span>,
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        render: (text) => <Tag color="geekblue" style={{ fontWeight: 600 }}>{text}</Tag>,
      },
      {
        title: <span style={{ color: '#277dfe', fontWeight: 700 }}><InfoCircleOutlined /> Raison</span>,
        dataIndex: 'reason',
        key: 'reason',
        align: 'center',
        render: (text) => <span style={{ color: '#222', fontWeight: 500 }}>{text}</span>,
      },
      {
        title: <span style={{ color: '#222', fontWeight: 700 }}><InfoCircleOutlined /> Statut</span>,
        key: 'status',
        align: 'center',
        render: (_, record) => {
          let color = '#222';
          if (record.status === 'Approuvé') color = '#389e0d';
          else if (record.status === 'Refusé') color = '#cf1322';
          return (
            <>
              <Tag color="#d9d9d9" style={{ color, fontWeight: 600, fontSize: 13, padding: '2px 12px', marginRight: 8 }}>{record.status}</Tag>
              {record.status === 'En attente' || record.status === 'pending' ? (
                <Button size="small" type="primary" onClick={() => openDrawer(record)} style={{ fontWeight: 500 }}>
                  Modifier
                </Button>
              ) : null}
            </>
          );
        },
      },
    ];
  
    return (
      <div style={{ maxHeight: 220, overflowY: 'auto' }}>
        <Table
          columns={dayOffColumns}
          dataSource={dayOffData}
          size='small'
          pagination={false}
          rowClassName={(_, idx) => idx % 2 === 0 ? 'vac-table-row-even' : 'vac-table-row-odd'}
          style={{ borderRadius: 12, boxShadow: '0 2px 8px #e6f0ff', margin: 0 }}
        />
        <style>{`
          .vac-table-row-even { background: #f9fbff !important; }
          .vac-table-row-odd { background: #fff !important; }
          .ant-table-tbody > tr:hover > td { background: #e6f7ff !important; }
        `}</style>
      </div>
    );
  };

  const openDrawer = (record) => {
    setSelectedVacation(record);
    const user = userData.find(user => user.id === record.user_id);
    setSelectedUser(user);
    form.setFieldsValue({
      status: record.status,
    });
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedVacation(null);
    setSelectedUser(null);
  };

  const onFinish = async (values) => {
    if (!selectedVacation) return;

    try {
        const token = localStorage.getItem('ACCESS_TOKEN');

        if (!token) {
            message.error('User is not authenticated');
            return;
        }

        const response = await axios.put(`http://127.0.0.1:8000/api/vacations/${selectedVacation.id}`, {
            type: selectedVacation.type,
            start_date: selectedVacation.start_date,
            end_date: selectedVacation.end_date,
            status: values.status,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('Day off request update successful', response.data);

        message.success('Day off request updated successfully');
        setDrawerVisible(false);
        fetchUserData();
    } catch (error) {
        console.error('Day off request update failed', error);

        if (error.response) {
            console.error('Server response:', error.response.data);
            if (error.response.data && error.response.data.error) {
                message.error(`Error: ${error.response.data.error}`);
            } else if (error.response.data.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
                message.error(`Validation errors: ${errorMessages}`);
            } else {
                message.error('Failed to update day off request');
            }
        } else {
            message.error('Failed to update day off request');
        }
    }
};

  // Stats for quick overview
  const totalUsers = userData.length;
  const allRequests = userData.flatMap(u => u.vacationRequests || []);
  const totalRequests = allRequests.length;
  const approved = allRequests.filter(r => r.status === 'Approuvé').length;
  const pending = allRequests.filter(r => r.status === 'En attente' || r.status === 'pending').length;
  const refused = allRequests.filter(r => r.status === 'Refusé').length;

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} md={6}>
          <Card style={{ marginBottom: 16, borderRadius: 12, background: '#fffbe6', boxShadow: '0 2px 8px #ffe58f' }}>
            <Title level={5} style={{ marginBottom: 4 }}>Legend</Title>
            <div><Tag color="green">Approuvé</Tag> Approved</div>
            <div><Tag color="orange">En attente</Tag> Pending</div>
            <div><Tag color="red">Refusé</Tag> Refused</div>
          </Card>
          <Card style={{ borderRadius: 12, background: '#f9fbff' }}>
            <Title level={5} style={{ marginBottom: 4 }}>Tip of the Day</Title>
            <Text type="secondary">Click on a user to expand and see their vacation requests. Use the filter/search to quickly find users or requests.</Text>
          </Card>
        </Col>
        <Col xs={24} md={18}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, marginBottom: 32 }}>
            <Card 
              title={<div style={{ width: '100%', textAlign: 'center', fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>Tools</div>} 
              bordered={false} 
              style={{ 
                borderRadius: 18, 
                background: '#fff', 
                boxShadow: '0 4px 16px #e6f0ff', 
                minWidth: 340, 
                display: 'flex', 
                alignItems: 'flex-start', 
                justifyContent: 'flex-start', 
                padding: 32, 
                border: '1px solid #e6f0ff',
                marginBottom: 32
              }}
            >
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 90px)', 
                gap: 18, 
                justifyContent: 'flex-start', 
                alignItems: 'center', 
                width: '100%', 
                minHeight: 198, 
                position: 'relative', 
                overflow: 'visible',
                padding: 8
              }}>
                {['calendar', 'watch', 'weather', 'quote'].map((tool) => (
                  <ToolBox
                    key={tool}
                    tool={tool}
                    expandedTool={expandedTool}
                    setExpandedTool={setExpandedTool}
                    onMouseEnter={() => setExpandedTool(tool)}
                    onMouseLeave={() => setExpandedTool(null)}
                  />
                ))}
              </div>
            </Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 80, height: 80, borderRadius: 16, background: '#fff', boxShadow: '0 1px 4px #e6f0ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <Statistic title={<span style={{ color: '#277dfe', fontWeight: 600, fontSize: 11 }}>Total Users</span>} value={totalUsers} valueStyle={{ color: '#277dfe', fontWeight: 700, fontSize: 16 }} />
                </div>
                <div style={{ width: 80, height: 80, borderRadius: 16, background: '#fff', boxShadow: '0 1px 4px #e6f0ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <Statistic title={<span style={{ color: '#389e0d', fontWeight: 600, fontSize: 11 }}>Approved</span>} value={approved} valueStyle={{ color: '#389e0d', fontWeight: 700, fontSize: 16 }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 80, height: 80, borderRadius: 16, background: '#fff', boxShadow: '0 1px 4px #e6f0ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <Statistic title={<span style={{ color: '#faad14', fontWeight: 600, fontSize: 11 }}>Total Requests</span>} value={totalRequests} valueStyle={{ color: '#faad14', fontWeight: 700, fontSize: 16 }} />
                </div>
                <div style={{ width: 80, height: 80, borderRadius: 16, background: '#fff', boxShadow: '0 1px 4px #e6f0ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <Statistic title={<span style={{ color: '#faad14', fontWeight: 600, fontSize: 11 }}>Pending</span>} value={pending} valueStyle={{ color: '#faad14', fontWeight: 700, fontSize: 16 }} />
                </div>
                <div style={{ width: 80, height: 80, borderRadius: 16, background: '#fff', boxShadow: '0 1px 4px #e6f0ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <Statistic title={<span style={{ color: '#cf1322', fontWeight: 600, fontSize: 11 }}>Refused</span>} value={refused} valueStyle={{ color: '#cf1322', fontWeight: 700, fontSize: 16 }} />
                </div>
              </div>
            </div>
          </div>
          <Card style={{ flex: 1, background: '#f0f5ff', borderRadius: 12, boxShadow: '0 2px 8px #e6f0ff', marginRight: 16 }}>
            <h2 style={{ color: '#277dfe', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><TeamOutlined /> Liste des Vacances</h2>
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 3,
                lg: 4,
                xl: 4,
                xxl: 4,
              }}
              dataSource={GlvacationsData}
              renderItem={(item) => (
                <List.Item>
                  <Card title={<span style={{ color: '#277dfe', fontWeight: 600 }}><CalendarTwoTone /> {item.title}</span>} style={{ borderRadius: 8, boxShadow: '0 1px 4px #e6f0ff', background: '#fff' }}>
                    <div style={{ color: '#faad14', fontWeight: 600 }}>Début: {item.startDate}</div>
                    <div style={{ color: '#52c41a', fontWeight: 500 }}>Fin: {item.endDate}</div>
                    <div style={{ color: item.status === 'Approuvé' ? '#389e0d' : '#faad14', fontWeight: 500 }}>Statut: {item.status}</div>
                  </Card>
                </List.Item>
              )}
            />
            <Table
              columns={columns}
              dataSource={userData}
              pagination={false}
              expandedRowRender={expandedRowRender}
              expandedRowKeys={expandedRowKeys}
              onExpand={(expanded, record) => toggleExpand(record.key)}
              style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #e6f0ff', marginTop: 24 }}
            />
          </Card>
        </Col>
      </Row>
      <Drawer
        title={<span style={{ color: '#277dfe', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><UserOutlined /> Informations Utilisateur</span>}
        placement="right"
        onClose={closeDrawer}
        visible={drawerVisible}
        width={420}
        bodyStyle={{ background: '#f9fbff', borderRadius: 12 }}
        headerStyle={{ background: '#277dfe', color: '#fff', borderRadius: '12px 12px 0 0' }}
      >
        {selectedVacation && (
          <>
            <Card style={{ background: '#fff', borderRadius: 10, marginBottom: 16, boxShadow: '0 1px 4px #e6f0ff' }}>
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label={<span style={{ color: '#277dfe', fontWeight: 600 }}><UserOutlined /> Nom</span>}>
                  {selectedUser ? selectedUser.name : ""}
                </Descriptions.Item>
                <Descriptions.Item label={<span style={{ color: '#722ed1', fontWeight: 600 }}><MailOutlined /> Email</span>}>
                  {selectedUser ? selectedUser.email : ""}
                </Descriptions.Item>
                <Descriptions.Item label={<span style={{ color: '#52c41a', fontWeight: 600 }}><InfoCircleOutlined /> Département</span>}>
                  {selectedUser ? selectedUser.department : ""}
                </Descriptions.Item>
                <Descriptions.Item label={<span style={{ color: '#faad14', fontWeight: 600 }}><TeamOutlined /> Rôle</span>}>
                  {selectedUser ? selectedUser.role : ""}
                </Descriptions.Item>
              </Descriptions>
            </Card>
            <Divider style={{ margin: '16px 0' }} />
            <Form form={form} onFinish={onFinish} layout="vertical">
              <Form.Item
                label={<span style={{ color: '#277dfe', fontWeight: 600 }}>Statut</span>}
                name="status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select size="large">
                  <Option value="Approuvé">Approuver</Option>
                  <Option value="Refusé">Refuser</Option>
                </Select>
              </Form.Item>
              <Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
                <Button type="primary" htmlType="submit" style={{ minWidth: 120, fontWeight: 600, fontSize: 16 }}>Mettre à jour</Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Drawer>
    </>
  );
};

export default VacationComponent;
