import React from 'react';
import { Button, Divider, Form, Input, Select, Space, DatePicker, message, Row, Col } from 'antd';
import axios from '../axios';
import moment from 'moment';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 14 }, // Adjust the span for label column
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }, // Adjust the span for input column
  },
};

const AddUser = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      // Map role names to IDs
      const roleMap = {
        'Admin': 1,
        'Moderator': 2,
        'Employee': 3,
      };

      // Prepare data per API spec: exact field names and date format YYYY-MM-DD
      const userData = {
        name: values.name,
        email: values.email,
        password: values.password,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
        genre: values.genre,
        adress: values.adress,
        phone_number: values.phone_number,
        sos_number: values.sos_number,
        social_situation: values.social_situation,
        role_id: roleMap[values.role] || parseInt(values.role),
        department_id: parseInt(values.department_id)
      };

      console.log('Sending user registration:', userData);

      // Send using project axios instance (has baseURL, CSRF token, auth headers)
      const token = localStorage.getItem('ACCESS_TOKEN');
      const response = await axios.post('/store', userData, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      console.log('Registration successful', response.data);
      message.success('Registration successful');
      form.resetFields();

    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      }

      // Handle 422 validation errors per API spec
      if (error.response?.status === 422) {
        const validation = error.response.data?.errors;
        if (validation && typeof validation === 'object') {
          const messages = Object.entries(validation)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('\n');
          message.error(`Validation errors:\n${messages}`);
        } else {
          message.error(error.response.data?.message || 'Validation failed');
        }
      } else if (error.response?.data?.message) {
        message.error(`Error: ${error.response.data.message}`);
      } else {
        message.error('Registration failed. Please try again.');
      }
    }
  };

  return (
    <>
      <h3>Informations Personnelles</h3>
      <Divider />
      <Form
        {...formItemLayout}
        form={form}
        style={{
          maxWidth: 700, // Adjust the max width of the form
          padding: '20px', // Add padding for better spacing
        }}
        onFinish={onFinish}
      >
        <Row gutter={[24, 19]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Nom"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Adresse email"
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              label="Date de naissance"
              name="dateOfBirth"
              rules={[{ required: true, message: 'Please select your date of birth!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Genre"
              name="genre"
              rules={[
                { required: true, message: 'Please select your gender!' },
                {
                  validator: (_, value) => {
                    if (!value || (value !== 'Male' && value !== 'Female')) {
                      return Promise.reject('Please select either Male or Female');
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Select 
                style={{ width: '100%' }}
                placeholder="Select Gender"
              >
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Adresse"
              name="adress"
              rules={[{ required: true, message: 'Please input your address!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              label="Numéro de téléphone"
              name="phone_number"
              rules={[
                { required: true, message: 'Please input your phone number!' },
                { pattern: /^\d{8}$/, message: 'Please enter a valid 8-digit phone number!' }
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              label="Numéro d'urgence"
              name="sos_number"
              rules={[
                { required: true, message: 'Please input your emergency number!' },
                { pattern: /^\d{8}$/, message: 'Please enter a valid 8-digit phone number!' }
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              label="Situation familiale"
              name="social_situation"
              rules={[{ required: true, message: 'Please select your social situation!' }]}
            >
              <Select style={{ width: '100%' }}>
                <Option value="Célibataire">Célibataire</Option>
                <Option value="Marié">Marié</Option>
                <Option value="Autres">Autres</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              label="Département"
              name="department_id"
              rules={[{ required: true, message: 'Please select a department!' }]}
            >
              <Select style={{ width: '100%' }}>
                <Option value="1">dev</Option>
                <Option value="2">assistant</Option>
                <Option value="3">Administration</Option>
    
              </Select>
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: 'Please select a role!' }]}
            >
              <Select style={{ width: '100%' }}>
                <Option value="Admin">Admin</Option>
                <Option value="Moderator">Moderator</Option>
                <Option value="Employee">Employee</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Suivant
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AddUser;
