import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, message, Drawer, Form, Input as AntInput } from 'antd';
import { SearchOutlined, UserOutlined, InfoCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const UsersView = ({ employees = [] }) => {
  const [searchText, setSearchText] = useState('');
  const [department, setDepartment] = useState('');
  const [updateDrawerVisible, setUpdateDrawerVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filtered, setFiltered] = useState(employees);

  // Compute unique department options
  const departmentOptions = Array.from(new Set(employees.map(e => e.department).filter(Boolean)));

  useEffect(() => {
    setFiltered(
      employees.filter(user =>
        (user.name.toLowerCase().includes(searchText.toLowerCase()) ||
         user.email.toLowerCase().includes(searchText.toLowerCase()) ||
         (user.department && user.department.toLowerCase().includes(searchText.toLowerCase()))) &&
        (department ? user.department === department : true)
      )
    );
  }, [searchText, employees, department]);

  useEffect(() => {
    const handler = (e) => exportToCSV(e.detail);
    window.addEventListener('export-employees-csv', handler);
    return () => window.removeEventListener('export-employees-csv', handler);
  }, []);

  const exportToCSV = (data) => {
    if (!data || !data.length) return;
    const replacer = (key, value) => value === null ? '' : value;
    const header = Object.keys(data[0]);
    const csv = [
      header.join(','),
      ...data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employes.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setUpdateDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setSelectedUser(null);
    setUpdateDrawerVisible(false);
  };

  const handleUpdateFormSubmit = async (updatedUser) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/users/${updatedUser.id}`, updatedUser);
      setFiltered(filtered.map(user => (user.id === updatedUser.id ? response.data : user)));
      message.success('User updated successfully');
      handleDrawerClose();
    } catch (error) {
      console.error('Error updating user:', error);
      message.error('Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/employees/${userId}`);
      setFiltered(filtered.filter(user => user.id !== userId));
      message.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email', width: 200 },
    { title: 'Address', dataIndex: 'adress', key: 'adress' },
    { title: 'Phone', dataIndex: 'phone_number', key: 'phone_number' },
    { title: 'SOS Number', dataIndex: 'sos_number', key: 'sos_number' },
    { title: 'Social Situation', dataIndex: 'social_situation', key: 'social_situation' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Date d\'embauche', dataIndex: 'created_at', key: 'created_at', render: d => d ? dayjs(d).format('DD/MM/YYYY') : '-' },
    { title: 'Anniversaire', dataIndex: 'birthday', key: 'birthday', render: d => d ? dayjs(d).format('DD/MM') : '-' },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="link" onClick={() => handleUpdate(record)} style={{ color: '#1890ff' }}>
            Update
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Input
        placeholder="Search"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        style={{ marginBottom: 8, width: '100%' }}
        prefix={<SearchOutlined />}
        allowClear
      />
      {/* Department button filter below search bar */}
      <div style={{ margin: '8px 0 16px 0', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <Button size="small" onClick={() => setDepartment('')} type={!department ? 'primary' : 'default'}>Tous</Button>
        {departmentOptions.map(dep => (
          <Button key={dep} size="small" onClick={() => setDepartment(dep)} type={department === dep ? 'primary' : 'default'}>{dep}</Button>
        ))}
      </div>
      <Button onClick={() => setSearchText('')} style={{ marginBottom: 16 }}>Reset</Button>
      <Table
        columns={columns.map(col =>
          col.key === 'action'
            ? { ...col, width: 120, align: 'center' }
            : { ...col, title: <span style={{ color: '#277dfe', fontWeight: 600, fontSize: 15 }}>{col.title}</span>, align: 'center', render: col.render || ((text) => <span style={{ color: '#222' }}>{text}</span>) }
        )}
        size='small'
        dataSource={filtered}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        style={{ background: '#f0f5ff', borderRadius: 12, boxShadow: '0 2px 8px #e6f0ff', marginTop: 16 }}
      />
      <Drawer
        title="modifier"
        placement="right"
        onClose={handleDrawerClose}
        visible={updateDrawerVisible}
        destroyOnClose={true}
        width={window.innerWidth > 768 ? 500 : '100%'}
      >
        <Form
          layout="vertical"
          onFinish={handleUpdateFormSubmit}
          initialValues={selectedUser}
        >
          <Form.Item name="id" style={{ display: 'none' }}>
            <AntInput />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter name' }]}>
            <AntInput />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter email' }]}>
            <AntInput />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <AntInput />
          </Form.Item>
          <Form.Item name="phone_number" label="Phone Number" rules={[
            { 
              required: true, 
              message: 'Please enter phone number' 
            },
            {         
              pattern: /^[0-9]+$/,
              message: 'Please enter a valid phone number'
            }
          ]}>
            <AntInput />
          </Form.Item>
          <Form.Item name="sos_number" label="SOS Number" rules={[
            { 
              required: true, 
              message: 'Please enter phone number' 
            },
            {         
              pattern: /^[0-9]+$/,
              message: 'Please enter a valid phone number'
            }
          ]}>
            <AntInput />
          </Form.Item>
          <Form.Item
            name="social_situation"
            label="Social Situation"
            rules={[{ required: true, message: 'Please select social situation' }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: 'Please select department' }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Update</Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default UsersView;
