import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, message, Drawer, Form, Input as AntInput, Select, Space, Popconfirm } from 'antd';
import { SearchOutlined, UserOutlined, InfoCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import { useRealTimeData } from '../hooks/useRealTimeData';

const { Option } = Select;

const UserTable = () => {
  const [searchText, setSearchText] = useState('');
  const [department, setDepartment] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  
  // Use real-time data hook for users
  const { data: users, loading, error, refresh } = useRealTimeData('http://127.0.0.1:8000/api/employees');

  // Compute unique department options
  const departmentOptions = [
    { id: 1, name: 'Sales' },
    { id: 2, name: 'IT' },
    { id: 3, name: 'HR' },
    { id: 4, name: 'Marketing' },
    { id: 5, name: 'Finance' },
  ]; // Replace with actual API call if needed

  useEffect(() => {
    console.log('Fetched users:', users); // Log the users data to inspect its structure
    const handler = (e) => exportToCSV(e.detail);
    window.addEventListener('export-employees-csv', handler);
    return () => window.removeEventListener('export-employees-csv', handler);
  }, [users]);

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

  const handleUpdateFormSubmit = async (values) => {
    try {
      const token = localStorage.getItem('ACCESS_TOKEN');
      const updatedData = {
        ...values,
        department: { name: values.department }, // Adjusted to match API structure
        role: { name: values.role }, // Adjusted to match API structure
      };
      await axios.put(`http://127.0.0.1:8000/api/employees/${selectedUser.id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      message.success('User updated successfully');
      setDrawerVisible(false);
      refresh(); // Refresh data after update
    } catch (error) {
      message.error('Failed to update user');
      console.error('Update error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('ACCESS_TOKEN');
      await axios.delete(`http://127.0.0.1:8000/api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      message.success('User deleted successfully');
      refresh(); // Refresh data after delete
    } catch (error) {
      message.error('Failed to delete user');
      console.error('Delete error:', error);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Department',
      dataIndex: 'department_id',
      key: 'department',
      render: (departmentId) => {
        const department = departmentOptions.find(dep => dep.id === departmentId);
        return department ? department.name : 'N/A';
      },
    },
    {
      title: 'Role',
      dataIndex: ['role', 'name'],
      key: 'role',
      render: (role) => role || 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => {
            setSelectedUser(record);
            form.setFieldsValue({
              ...record,
              department: record.department_id,
              role: record.role?.name,
            });
            setDrawerVisible(true);
          }}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (error) {
    return <div>Error: {error}</div>;
  }

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
          <Button key={dep.id} size="small" onClick={() => setDepartment(dep.name)} type={department === dep.name ? 'primary' : 'default'}>{dep.name}</Button>
        ))}
      </div>
      <Button onClick={() => setSearchText('')} style={{ marginBottom: 16 }}>Reset</Button>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        style={{ background: '#f0f5ff', borderRadius: 12, boxShadow: '0 2px 8px #e6f0ff', marginTop: 16 }}
      />

      <Drawer
        title="Edit User"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        width={500}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleUpdateFormSubmit}
        >
          <Form.Item name="id" style={{ display: 'none' }}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="department" label="Department" rules={[{ required: true, message: 'Please select department' }]}>
            <Select>
              {departmentOptions.map(dep => (
                <Option key={dep.id} value={dep.id}>{dep.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Please select role' }]}>
            <Select>
              <Option value="Admin">Admin</Option>
              <Option value="Moderator">Moderator</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Update</Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default UserTable;
