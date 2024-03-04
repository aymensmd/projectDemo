import React, {useState} from 'react';
import { Button, Card, Checkbox, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom'; 

import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email: values.email,
        password: values.password,
      });

      console.log('Authentication successful', response.data);

      localStorage.setItem('token', response.data.token);
      console.log(response.data.token)
     
      navigate('/users');

      message.success('Authentication successful');
    } catch (error) {
      console.error('Authentication failed', error);
      message.error(error.response?.data?.message || 'Authentication failed. Please check your credentials.');
      setLoading(false);
    }
  };
  return (
    <Card>
      <h2 style={{ color: "#1677ff" }}>Sign Up!</h2>
      <br/>
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
          <Button type="primary" htmlType="submit" loading={loading}>
             submit
          </Button>
          <div style={{ marginTop: 10 }}>
            Don't have an account? <Link to="/signup">Signup</Link>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
}
