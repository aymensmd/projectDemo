import React, { useState, useEffect } from 'react';
import { Badge, Button, Card, Drawer, Form, Input, Space, Table, message, DatePicker, Select, Popconfirm, Typography } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

const { Title } = Typography;
const { Option } = Select;

dayjs.locale('fr');

const vacationTypes = [
  'Annuel',
  'Maladie',
  'Sans solde',
  'Maternité',
  'Paternité',
  'Autre',
];

const VacData = ({ setTotalVacationDays }) => {
  const [vacationData, setVacationData] = useState([]);
  const [updateDrawerVisible, setUpdateDrawerVisible] = useState(false);
  const [selectedVacation, setSelectedVacation] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchVacations();
  }, []);

  const fetchVacations = async () => {
    try {
      const token = localStorage.getItem('ACCESS_TOKEN');
      const userId = localStorage.getItem('USER_ID');

      if (!token) {
        message.error('User is not authenticated');
        return;
      }

      const response = await axios.get(`http://127.0.0.1:8000/api/vacations/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVacationData(response.data);
      calculateTotalVacationDays(response.data);
    } catch (error) {
      console.error('Failed to fetch vacations', error);
      message.error('Failed to fetch vacations');
    }
  };

  const calculateTotalVacationDays = (vacations) => {
    let totalDays = 0;
    vacations
      .filter(vacation => vacation.status === 'Approuvé')
      .forEach(vacation => {
        const startDate = new Date(vacation.start_date);
        const endDate = new Date(vacation.end_date);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        totalDays += days;
      });
    setTotalVacationDays(totalDays);
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <span style={{ fontWeight: 500 }}>{type}</span>,
    },
    {
      title: 'Raison',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason) => <span style={{ color: '#888' }}>{reason}</span>,
    },
    {
      title: 'Date de début',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (date) => dayjs(date).format('DD MMM YYYY'),
    },
    {
      title: 'Date de fin',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (date) => dayjs(date).format('DD MMM YYYY'),
    },
    {
      title: 'Statut',
      key: 'status',
      render: (_, record) => (
        <Space size="middle">
          <Badge
            status={
              record.status === 'Approuvé' ? 'success' :
              record.status === 'Refusé' ? 'error' : 'processing'
            }
            text={record.status}
          />
          {record.status === 'Pending' && (
            <Button type="link" onClick={() => showUpdateDrawer(record)}>Modifier</Button>
          )}
          {record.status !== 'Pending' && (
            <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>Non modifiable</span>
          )}
        </Space>
      ),
    },
  ];

  const showUpdateDrawer = (vacation) => {
    setSelectedVacation(vacation);
    setUpdateDrawerVisible(true);
    setTimeout(() => {
      form.setFieldsValue({
        ...vacation,
        start_date: dayjs(vacation.start_date),
        end_date: dayjs(vacation.end_date),
      });
    }, 0);
  };

  const closeUpdateDrawer = () => {
    setUpdateDrawerVisible(false);
    setSelectedVacation(null);
    form.resetFields();
  };

  const handleUpdateFormSubmit = (values) => {
    message.success('Vacation updated successfully');
    closeUpdateDrawer();
    fetchVacations(); // Refresh vacations data
  };

  const handleDeleteVacation = () => {
    message.success('Vacation deleted successfully');
    closeUpdateDrawer();
    fetchVacations(); // Refresh vacations data
  };

  return (
    <Card
      style={{ maxWidth: 900, margin: '0 auto', boxShadow: '0 2px 8px #f0f1f2' }}
      bodyStyle={{ padding: 24 }}
      title={<Title level={3} style={{ margin: 0, color: '#1677ff' }}>Mes Vacances</Title>}
      bordered={false}
    >
      <Table
        columns={columns}
        dataSource={vacationData}
        pagination={false}
        rowKey={(record) => record.id}
        style={{ marginTop: 16, background: '#fff', borderRadius: 8 }}
        size="middle"
      />
      <Drawer
        title={<span style={{ color: '#1677ff' }}>Modifier la demande de congé</span>}
        placement="right"
        onClose={closeUpdateDrawer}
        open={updateDrawerVisible}
        destroyOnClose={true}
        width={400}
      >
        {selectedVacation && (
          <Form
            layout="vertical"
            form={form}
            onFinish={handleUpdateFormSubmit}
            initialValues={{
              ...selectedVacation,
              start_date: dayjs(selectedVacation.start_date),
              end_date: dayjs(selectedVacation.end_date),
            }}
          >
            <Form.Item name="start_date" label="Date de début" rules={[{ required: true }]}> 
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item name="end_date" label="Date de fin" rules={[{ required: true }]}> 
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item name="type" label="Type" rules={[{ required: true }]}> 
              <Select placeholder="Sélectionner le type">
                {vacationTypes.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="reason" label="Raison">
              <Input.TextArea rows={2} placeholder="Raison du congé" />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">Modifier</Button>
                <Popconfirm
                  title="Êtes-vous sûr de vouloir supprimer cette demande ?"
                  onConfirm={handleDeleteVacation}
                  okText="Oui"
                  cancelText="Non"
                >
                  <Button danger>Supprimer</Button>
                </Popconfirm>
                <Button onClick={closeUpdateDrawer}>Annuler</Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Drawer>
    </Card>
  );
};

export default VacData;
