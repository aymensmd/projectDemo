import React from 'react';
import { Button, Divider, Form, Input, Mentions, Select, Space, DatePicker } from 'antd';
import axios from 'axios';
import { message } from 'antd';

import { Row, Col } from 'antd';
const { Option } = Select;
const { RangePicker } = DatePicker;

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
  const onFinish = async (values) => {
    try {
      // Convert date_naissance to ISO string
      values.date_naissance = values.date_naissance.toISOString().split('T')[0];
  
      // Send the form data to the API endpoint
      const response = await axios.post('http://127.0.0.1:8000/api/store', values);
  
      console.log('Registration successful', response.data);
  
      // Handle the registration success logic here
      message.success('Registration successful');
  
      // Redirect to the login page after successful registration
  
    } catch (error) {
      console.error('Registration failed', error);
      message.error('Registration failed');
  
      // Display the error message received from the server
      if (error.response && error.response.data && error.response.data.message) {
        message.error(`Registration failed: ${error.response.data.message}`);
      } else {
        message.error('Registration failed');
      }
    }
  };

  return (
    <>
      <h3>Informations Personnelles</h3>
      <Divider />
      <Form
        {...formItemLayout}
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
              name="nom"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Prénom"
              name="prenom"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Adresse email"
              name="email"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Input type="email" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Date de naissance"
              name="date_naissance"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
  <Form.Item
    label="Password"
    name="password"
    rules={[{ required: true, message: 'Please input your password!' }]}
  >
    <Input.Password />
  </Form.Item>
</Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Genre"
              name="genre"
              rules={[{ required: false, message: 'Please input!' }]}
            >
              <Select style={{ width: '100%' }}>
                <Option value="Homme">Homme</Option>
                <Option value="Femme">Femme</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Adresse"
              name="adresse"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Mentions style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Numéro de téléphone"
              name="numero_telephone"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Input style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Numéro d'urgence"
              name="numero_urgence"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Space>
                <Input  defaultValue="" />
              </Space>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Situation familiale"
              name="situation_familiale"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Select style={{ width: '100%' }}>
                <Option value="Célibataire">Célibataire</Option>
                <Option value="Marié">Marié</Option>
                <Option value="Autres">Autres</Option>
              </Select>
            </Form.Item>
          </Col>
        
          
          {/* Add more Form.Items here */}
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
