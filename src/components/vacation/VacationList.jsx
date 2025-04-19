import React, { useState } from 'react';
import { Table, Tag, Space, Button, Select, Popconfirm, message, Modal, Form, Input, DatePicker, Tooltip } from 'antd';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const STATUS_COLORS = {
  'En attente': 'gold',
  'Approuvé': 'green',
  'Rejeté': 'red'
};

const VacationList = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [selectedVacation, setSelectedVacation] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { data: vacations, loading, error, refresh } = useRealTimeData('http://127.0.0.1:8000/api/vacations');
  const { user } = useAuth();

  const handleStatusChange = async (id, newStatus, userId, reason) => {
    if (userId === user?.id) {
      message.error('You cannot modify your own vacation request');
      return;
    }

    if (user?.role !== 'Admin') {
      message.error('Only administrators can modify vacation requests');
      return;
    }

    try {
      const token = localStorage.getItem('ACCESS_TOKEN');
      await axios.put(`http://127.0.0.1:8000/api/vacations/${id}`, 
        { 
          status: newStatus,
          status_reason: reason
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );
      
      message.success('Status updated successfully');
      refresh();
    } catch (error) {
      message.error('Failed to update status');
      console.error('Update error:', error);
    }
  };

  const handleDelete = async (id, userId) => {
    if (userId === user?.id) {
      message.error('You cannot delete your own vacation request');
      return;
    }

    if (user?.role !== 'Admin') {
      message.error('Only administrators can delete vacation requests');
      return;
    }

    try {
      const token = localStorage.getItem('ACCESS_TOKEN');
      await axios.delete(`http://127.0.0.1:8000/api/vacations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      message.success('Vacation request deleted successfully');
      refresh();
    } catch (error) {
      message.error('Failed to delete vacation request');
      console.error('Delete error:', error);
    }
  };

  const showModal = (record) => {
    setSelectedVacation(record);
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem('ACCESS_TOKEN');
      
      await axios.put(`http://127.0.0.1:8000/api/vacations/${selectedVacation.id}`, 
        { 
          ...values,
          start_date: values.start_date.format('YYYY-MM-DD'),
          end_date: values.end_date.format('YYYY-MM-DD')
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );
      
      message.success('Vacation request updated successfully');
      setIsModalVisible(false);
      refresh();
    } catch (error) {
      message.error('Failed to update vacation request');
      console.error('Update error:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const filteredVacations = vacations?.filter(vacation => {
    const matchesStatus = statusFilter ? vacation.status === statusFilter : true;
    const matchesType = typeFilter ? vacation.type === typeFilter : true;
    const matchesDate = dateRange ? 
      (dayjs(vacation.start_date).isAfter(dateRange[0]) && 
       dayjs(vacation.end_date).isBefore(dateRange[1])) : true;
    
    return matchesStatus && matchesType && matchesDate;
  });

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Annual Leave', value: 'Annual Leave' },
        { text: 'Sick Leave', value: 'Sick Leave' },
        { text: 'Personal Leave', value: 'Personal Leave' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      key: 'start_date',
      render: date => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.start_date) - new Date(b.start_date),
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      key: 'end_date',
      render: date => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.end_date) - new Date(b.end_date),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Tooltip title={record.status_reason || 'No reason provided'}>
          <Tag color={STATUS_COLORS[status]}>
            {status}
          </Tag>
        </Tooltip>
      ),
      filters: [
        { text: 'En attente', value: 'En attente' },
        { text: 'Approuvé', value: 'Approuvé' },
        { text: 'Rejeté', value: 'Rejeté' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const isOwnRequest = record.user_id === user?.id;
        const isAdmin = user?.role === 'Admin';
        const canModify = isAdmin && !isOwnRequest;
        
        return (
          <Space size="middle">
            <Button type="link" onClick={() => showModal(record)}>
              View Details
            </Button>
            {canModify && (
              <>
                <Select
                  defaultValue={record.status}
                  style={{ width: 120 }}
                  onChange={(value) => {
                    Modal.confirm({
                      title: 'Change Status',
                      content: (
                        <Form>
                          <Form.Item
                            name="reason"
                            label="Reason"
                            rules={[{ required: true, message: 'Please provide a reason' }]}
                          >
                            <TextArea rows={4} />
                          </Form.Item>
                        </Form>
                      ),
                      onOk: (close) => {
                        const form = Modal.confirm().destroy();
                        const values = form.getFieldsValue();
                        handleStatusChange(record.id, value, record.user_id, values.reason);
                        close();
                      },
                    });
                  }}
                  disabled={isOwnRequest}
                >
                  <Option value="En attente">En attente</Option>
                  <Option value="Approuvé">Approuvé</Option>
                  <Option value="Rejeté">Rejeté</Option>
                </Select>
                <Popconfirm
                  title="Are you sure you want to delete this vacation request?"
                  onConfirm={() => handleDelete(record.id, record.user_id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary" danger disabled={isOwnRequest}>Delete</Button>
                </Popconfirm>
              </>
            )}
            {isOwnRequest && <Tag color="blue">Your Request</Tag>}
          </Space>
        );
      },
    },
  ];

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Select
          style={{ width: 200 }}
          placeholder="Filter by status"
          onChange={setStatusFilter}
          allowClear
        >
          <Option value="En attente">En attente</Option>
          <Option value="Approuvé">Approuvé</Option>
          <Option value="Rejeté">Rejeté</Option>
        </Select>
        
        <Select
          style={{ width: 200 }}
          placeholder="Filter by type"
          onChange={setTypeFilter}
          allowClear
        >
          <Option value="Annual Leave">Annual Leave</Option>
          <Option value="Sick Leave">Sick Leave</Option>
          <Option value="Personal Leave">Personal Leave</Option>
        </Select>

        <DatePicker.RangePicker
          style={{ width: 300 }}
          onChange={setDateRange}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredVacations}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
      />

      <Modal
        title="Vacation Request Details"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            ...selectedVacation,
            start_date: selectedVacation ? dayjs(selectedVacation.start_date) : null,
            end_date: selectedVacation ? dayjs(selectedVacation.end_date) : null,
          }}
        >
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please select a type' }]}
          >
            <Select>
              <Option value="Annual Leave">Annual Leave</Option>
              <Option value="Sick Leave">Sick Leave</Option>
              <Option value="Personal Leave">Personal Leave</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="start_date"
            label="Start Date"
            rules={[{ required: true, message: 'Please select a start date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="end_date"
            label="End Date"
            rules={[{ required: true, message: 'Please select an end date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea rows={4} />
          </Form.Item>

          {user?.role === 'Admin' && (
            <Form.Item
              name="status"
              label="Status"
            >
              <Select>
                <Option value="En attente">En attente</Option>
                <Option value="Approuvé">Approuvé</Option>
                <Option value="Rejeté">Rejeté</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default VacationList; 