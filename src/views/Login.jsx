import React, { useState, useEffect } from 'react';
import { Button, Card, Checkbox, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import axios from '../axios';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import AnyNamecrm from '../assets/AnyNamecrm.png';
import crm from '../assets/crm.png';
import './login.css';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setToken, setUser } = useStateContext();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const payload = { email: values.email, password: values.password };
      // helpful debug logging for backend validation errors
      // remove or reduce in production
      // console.log('login payload', payload);

      const response = await axios.post('/login', payload);

      const { token, user } = response.data;

      localStorage.setItem('ACCESS_TOKEN', token);
      localStorage.setItem('USER_DATA', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setToken(token);
      setUser(user);

      navigate('/dashboard');
      message.success('Welcome back!');
    } catch (error) {
      // Log full response for debugging (server validation details)
      // eslint-disable-next-line no-console
      console.error('Login error response:', error.response?.data ?? error);

      // If backend returned validation errors (422), show them clearly
      if (error.response?.status === 422) {
        const validation = error.response.data?.errors;
        if (validation && typeof validation === 'object') {
          // Collect all messages into one string
          const messages = Object.values(validation).flat().join(' ');
          message.error(messages || 'Validation failed.');
        } else {
          // Fallback to any message provided
          message.error(error.response.data?.message || 'Validation failed.');
        }
      } else {
        message.error(error.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <Card className="login-card">
          <div className="login-header">
            <img src={AnyNamecrm} alt="AnyName CRM" className="login-logo" />
            <h1 className="login-title">Welcome to AnyName</h1>
            <p className="login-subtitle">Your business communication hub</p>
          </div>
          
          <Form
            name="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            className="login-form"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined className="input-icon" />} 
                placeholder="Email address" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="input-icon" />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <div className="login-options">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                size="large"
                className="login-button"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>

      <div className="animated-background">
        <div className="water-blob water-blob-1"></div>
        <div className="water-blob water-blob-2"></div>
    
        <div className="water-blob water-blob-3"></div>
        <div className="water-blob water-blob-4"></div>
      </div>
    </div>
  );
}