import React, { useState } from 'react';
import { Button, Card, Checkbox, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom'; 
import { useStateContext } from '../contexts/ContextProvider';
import axios from 'axios';
import './login.css';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setToken, setUser } = useStateContext();
  
  const onFinish = async (values) => {
    try {
      setLoading(true);
  
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email: values.email,
        password: values.password,
      });
  
      const { token, user } = response.data;
  
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set token globally for axios
      localStorage.setItem('ACCESS_TOKEN', token); // Store token in localStorage
      localStorage.setItem('USER_ID', user.id); // Store user ID in localStorage

      setToken(token);
      setUser(user);
  
      navigate('/app');
      message.success('Authentication successful');
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          'Authentication failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <h2>Welcome to Comunik!</h2>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
