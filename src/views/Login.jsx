import React, { useState } from 'react';
import { Button, Card, Checkbox, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom'; 
import { useStateContext } from '../contexts/ContextProvider';
import axios from 'axios';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import comunikcrm from '../assets/comunikcrm.png';
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
  
      navigate('/dashboard');
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
    <div
      className="login-container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `url('/src/assets/company-representatives-reading-applicant-resume-hiring.jpg') center/cover no-repeat`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(245,247,250,0.85)',
          zIndex: 1,
          backdropFilter: 'blur(6px)',
        }}
      />
      <Card
        className="login-card"
        style={{
          minWidth: 320,
          maxWidth: 380,
          width: '100%',
          borderRadius: 20,
          boxShadow: '0 8px 32px 0 rgba(39,125,254,0.10)',
          zIndex: 2,
          padding: 0,
          position: 'relative',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.95)',
          border: '1px solid #e6f0ff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        bodyStyle={{ padding: 28, paddingTop: 18, paddingBottom: 18 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 10, marginTop: 2 }}>
          <img
            src={comunikcrm}
            alt="Comunik Logo"
            style={{ width: 100, marginBottom: 4, filter: 'drop-shadow(0 2px 8px #e6f0ff)' }}
          />
          <h2
            style={{
              color: '#1677ff',
              fontWeight: 700,
              marginBottom: 0,
              fontSize: 22,
              letterSpacing: 0.5,
            }}
          >
            Sign in to Comunik
          </h2>
          <div style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>
            Enter your credentials to access your account
          </div>
        </div>
        <div style={{ borderBottom: '1px solid #f0f0f0', margin: '0 0 18px 0', width: '100%' }} />
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          style={{ width: '100%' }}
        >
          <Form.Item
            label={<span style={{ color: '#1677ff', fontWeight: 500 }}>Email</span>}
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#1677ff' }} />}
              placeholder="Email"
              aria-label="Email"
              size="large"
              style={{ borderRadius: 8, background: '#f5f7fa' }}
              autoFocus
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: '#1677ff', fontWeight: 500 }}>Password</span>}
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#1677ff' }} />}
              placeholder="Password"
              aria-label="Password"
              size="large"
              style={{ borderRadius: 8, background: '#f5f7fa' }}
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Checkbox>Remember me</Checkbox>
              <Link to="/forgot-password" style={{ fontSize: 13, color: '#1677ff' }}>Forgot password?</Link>
            </div>
          </Form.Item>

          <Form.Item style={{ marginTop: 18, marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{ borderRadius: 8, fontWeight: 600, background: '#1677ff', border: 'none', boxShadow: '0 2px 8px #e6f0ff' }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
