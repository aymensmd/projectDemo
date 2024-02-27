import React from 'react';
import { Button, Card, Checkbox, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom'; 

import axios from 'axios';

export default function Login() {
  const navigate = useNavigate(); 

  const onAuthenticate = () => {
    // Logic to execute after authentication
    console.log('User authenticated');
  };

  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email: values.email,
        password: values.password,
      });
  
      console.log('Authentication successful', response.data);
  
      localStorage.setItem('token', response.data.token);
  
      // Redirect to the dashboard upon successful authentication
      navigate('/dashboard');
  
      message.success('Authentication successful');
    } catch (error) {
      console.error('Authentication failed', error);
      message.error('Authentication failed');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Card>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your email!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <div style={{ marginTop: 10 }}>
            Don't have an account? <Link to="/signup">Signup</Link>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
}
