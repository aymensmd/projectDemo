import React, { useState, useEffect } from 'react';
import { Button, Card, Drawer, Typography, Row, Col, Statistic, Divider, Tooltip } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import Layout from 'antd/es/layout/layout';
import Form from '../Form/index';
import UserTable from './UserTable';
import axios from 'axios';
import dayjs from 'dayjs';

const { Content } = Layout;

const EmployeViewComponent = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/employees');
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      } catch (error) {
        setEmployees([]);
        setFilteredEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Department breakdown
  const departmentCounts = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});
  const departmentList = Object.entries(departmentCounts).map(([dept, count]) => ({ dept, count }));

  // Quick filter
  const handleDepartmentFilter = dept => {
    setDepartmentFilter(dept);
    if (dept === '') setFilteredEmployees(employees);
    else setFilteredEmployees(employees.filter(e => e.department === dept));
  };

  // Recent hires (last 30 days)
  const recentHires = employees.filter(e => e.created_at && dayjs(e.created_at).isAfter(dayjs().subtract(30, 'day')));

  // Upcoming birthdays (next 30 days)
  const upcomingBirthdays = employees.filter(e => {
    if (!e.birthday) return false;
    const thisYear = dayjs().year();
    const bday = dayjs(e.birthday).year(thisYear);
    const now = dayjs();
    return bday.isAfter(now) && bday.isBefore(now.add(30, 'day'));
  });

  // Upcoming anniversaries (next 30 days)
  const upcomingAnniversaries = employees.filter(e => {
    if (!e.created_at) return false;
    const thisYear = dayjs().year();
    const anniv = dayjs(e.created_at).year(thisYear);
    const now = dayjs();
    return anniv.isAfter(now) && anniv.isBefore(now.add(30, 'day'));
  });

  return (
    <Content className="content">
      <Card style={{ margin: 16, padding: 24 }} loading={loading}>
        <Typography.Title level={3} style={{ marginBottom: 0 }}>Gestion des employés</Typography.Title>
        <Typography.Text type="secondary" style={{ fontSize: 16 }}>
          Ajoutez, modifiez, filtrez, exportez et consultez les informations des employés.
        </Typography.Text>
        <Divider />
        <Row gutter={[32, 32]}>
          <Col xs={24} md={16}>
            <div style={{ background: '#f6f9ff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #e6f0ff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                {/* Buttons on the top right */}
                <div style={{ flex: 1 }} />
                <div style={{ display: 'flex', gap: 12 }}>
                  <Button
                    icon={<PlusOutlined />} 
                    type="primary" 
                    size="large"
                    style={{ fontWeight: 600 }}
                    onClick={() => setDrawerVisible(true)}
                  >
                    Ajouter
                  </Button>
                  <Button
                    size="large"
                    style={{ fontWeight: 600 }}
                    onClick={() => window.dispatchEvent(new CustomEvent('export-employees-csv', { detail: filteredEmployees }))}
                  >
                    Exporter CSV
                  </Button>
                </div>
              </div>
             
              <UserTable employees={filteredEmployees} />
            </div>
          </Col>
          <Col xs={24} md={8}>
            <Card bordered={false} style={{ background: '#f0f5ff', borderRadius: 12, marginBottom: 24 }}>
              <Statistic
                title="Nombre total d'employés"
                value={employees.length}
                prefix={<UserOutlined />}
              />
            </Card>
            <Card bordered={false} style={{ background: '#f0f5ff', borderRadius: 12, marginBottom: 24 }}>
              <Typography.Title level={5} style={{ marginBottom: 8 }}>Répartition par département</Typography.Title>
              {departmentList.length === 0 ? (
                <Typography.Text type="secondary">Aucun département</Typography.Text>
              ) : (
                <ul style={{ paddingLeft: 18, margin: 0 }}>
                  {departmentList.map(d => (
                    <li key={d.dept} style={{ fontWeight: departmentFilter === d.dept ? 600 : 400, color: departmentFilter === d.dept ? '#1677ff' : '#222' }}>{d.dept}: {d.count}</li>
                  ))}
                </ul>
              )}
            </Card>
            <Card bordered={false} style={{ background: '#f0f5ff', borderRadius: 12 }}>
              <Typography.Title level={5}>Nouvelles embauches</Typography.Title>
              {recentHires.length === 0 ? <Typography.Text type="secondary">Aucune embauche récente</Typography.Text> : recentHires.map(e => <div key={e.id}>{e.name} ({e.department}) - {dayjs(e.created_at).format('DD/MM/YYYY')}</div>)}
              <Divider style={{ margin: '12px 0' }} />
              <Typography.Title level={5}>Anniversaires & Entrées à venir</Typography.Title>
              {upcomingBirthdays.length === 0 && upcomingAnniversaries.length === 0 ? <Typography.Text type="secondary">Aucun événement à venir</Typography.Text> : <>
                {upcomingBirthdays.map(e => <div key={e.id + '-bday'}>🎂 {e.name} - {dayjs(e.birthday).format('DD/MM')}</div>)}
                {upcomingAnniversaries.map(e => <div key={e.id + '-anniv'}>🎉 {e.name} - {dayjs(e.created_at).format('DD/MM')}</div>)}
              </>}
            </Card>
          </Col>
        </Row>
      </Card>
      <Drawer
        title="Ajouter un employé"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={window.innerWidth > 1508 ? 1000 : '100%'}
      >
        <Form />
      </Drawer>
    </Content>
  );
};

export default EmployeViewComponent;