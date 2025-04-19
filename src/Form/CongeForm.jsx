import React, { useEffect, useState } from 'react';
import { Button, Divider, Form, Input, Select, DatePicker, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const DayOffRequestForm = () => {
  const [hasPendingVacation, setHasPendingVacation] = useState(false);
  const [startDate, setStartDate] = useState(null);

  useEffect(() => {
    const fetchPendingVacation = async () => {
      try {
        const token = localStorage.getItem('ACCESS_TOKEN');

        if (!token) {
          message.error('User is not authenticated');
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/vacations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const pendingVacation = response.data.find(vacation => vacation.status === 'pending');
        if (pendingVacation) {
          setHasPendingVacation(true);
        }
      } catch (error) {
        console.error('Failed to fetch vacations', error);
      }
    };

    fetchPendingVacation();
  }, []);

  const onFinish = async (values) => {
    if (hasPendingVacation) {
      message.error('You already have a pending vacation request. Please wait until it is approved or rejected.');
      return;
    }

    try {
      const token = localStorage.getItem('ACCESS_TOKEN');

      if (!token) {
        message.error('User is not authenticated');
        return;
      }

      const response = await axios.post('http://127.0.0.1:8000/api/vacations', {
        type: values.dayOffType,
        start_date: values.startDate.format('YYYY-MM-DD'),
        end_date: values.endDate.format('YYYY-MM-DD'),
        reason: values.reason,
        status: 'pending',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Day off request successful', response.data);

      message.success('Day off request submitted successfully');
      setHasPendingVacation(true);
    } catch (error) {
      console.error('Day off request failed', error);

      if (error.response && error.response.data && error.response.data.errors) {
        message.error(`Error: ${JSON.stringify(error.response.data.errors)}`);
      } else {
        message.error('You already have a pending vacation request. Please wait until it is approved or rejected.');
      }
    }
  };

  const disabledStartDate = (current) => {
    // Can not select days before today
    return current && current < dayjs().startOf('day');
  };

  const disabledEndDate = (current) => {
    // Can not select days before the start date
    return current && current < dayjs(startDate).startOf('day');
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      padding: '32px 24px',
      margin: '24px auto',
      maxWidth: 600,
      minWidth: 320,
      minHeight: 480,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}> 
      <h2 style={{
        textAlign: 'center',
        fontWeight: 700,
        fontSize: '2rem',
        color: '#2d3a4b',
        marginBottom: 8,
        letterSpacing: 1,
      }}>
        Demande de congé
      </h2>
      <Divider style={{ margin: '12px 0 24px 0' }} />
      <Form {...formItemLayout} onFinish={onFinish} style={{ width: '100%', background: 'rgba(255,255,255,0.95)', borderRadius: '12px', padding: '24px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <Form.Item
          label="Type Congé"
          name="dayOffType"
          rules={[{ required: true, message: 'Please select type of day off' }]}
          labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
          wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
        >
          <Select size="large" placeholder="Sélectionner le type de congé">
            <Option value="Sick">Maladie</Option>
            <Option value="Vacation">Voyage</Option>
            <Option value="Personal">Personel</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Date début"
          name="startDate"
          rules={[{ required: true, message: 'Please select start date' }]}
          labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
          wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
        >
          <DatePicker 
            style={{ width: '100%' }} 
            size="large" 
            disabledDate={disabledStartDate}
            onChange={(date) => setStartDate(date)} 
            placeholder="Choisir la date de début"
          />
        </Form.Item>
        <Form.Item
          label="Date fin"
          name="endDate"
          rules={[{ required: true, message: 'Please select end date' }]}
          labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
          wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
        >
          <DatePicker 
            style={{ width: '100%' }} 
            size="large" 
            disabledDate={disabledEndDate} 
            placeholder="Choisir la date de fin"
          />
        </Form.Item>
        <Form.Item
          label="Raison"
          name="reason"
          rules={[{ required: true, message: 'Please provide reason for day off' }]}
          labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
          wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
        >
          <Input.TextArea size="large" placeholder="Décrivez la raison de votre congé" autoSize={{ minRows: 3, maxRows: 6 }} />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
          <Button type="primary" htmlType="submit" disabled={hasPendingVacation} style={{ width: '100%', maxWidth: '220px', fontWeight: 600, fontSize: '1.1rem', height: 48, borderRadius: 8 }}>
            Envoyer
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DayOffRequestForm;
