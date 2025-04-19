import React, { useState, useEffect } from 'react';
import { Card, Typography, Divider, Switch, Button, Modal, Form, Input, message, Popconfirm, Avatar, Tooltip, List } from 'antd';
import { SettingOutlined, LockOutlined, BellOutlined, UserOutlined, ExportOutlined, QuestionCircleOutlined, LogoutOutlined, MobileOutlined, CalendarOutlined, GlobalOutlined, DownloadOutlined } from '@ant-design/icons';
import { useStateContext } from '../contexts/ContextProvider';
import axios from '../axios';
import comunikcrm from '../assets/comunikcrm.png';

const SettingsPage = () => {
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [isEmailModalVisible, setEmailModalVisible] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [isThemeModalVisible, setThemeModalVisible] = useState(false);
  const [is2FAEnabled, set2FAEnabled] = useState(false);
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const { theme, setTheme, user: contextUser, setUser, token } = useStateContext();
  const user = contextUser || {};
  const [currentLanguage, setCurrentLanguage] = useState(() => localStorage.getItem('APP_LANGUAGE') || 'English');
  const [form] = Form.useForm();

  useEffect(() => {
    // Fetch latest user info if not present or to refresh
    const fetchUser = async () => {
      if (!token) return;
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/employees', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userId = localStorage.getItem('USER_ID');
        const currentUser = response.data.find(emp => String(emp.id) === String(userId));
        if (currentUser) setUser(currentUser);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, [token]);

  // Simulated session/device data
  const sessions = [
    { device: 'Windows PC', location: 'Tunis, Tunisia', lastActive: 'Now', current: true },
    { device: 'iPhone 14', location: 'Sousse, Tunisia', lastActive: '2 days ago', current: false },
  ];

  // Simulated preferences
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [defaultPage, setDefaultPage] = useState('Dashboard');

  const setLanguage = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem('APP_LANGUAGE', lang);
    message.success(`Language set to ${lang}`);
  };

  // Change Password
  const handlePasswordOk = () => {
    form.validateFields(['currentPassword', 'newPassword', 'confirmPassword'])
      .then(values => {
        // Simulate password change
        setPasswordModalVisible(false);
        message.success('Password changed successfully!');
        form.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
      })
      .catch(() => {});
  };

  // Update Email
  const handleEmailOk = () => {
    form.validateFields(['email'])
      .then(values => {
        setEmailModalVisible(false);
        message.success('Email updated successfully!');
        form.resetFields(['email']);
      })
      .catch(() => {});
  };

  // Delete Account
  const handleDeleteAccount = () => {
    message.success('Account deleted (simulated).');
  };

  // Data export
  const handleExportData = () => {
    message.success('Your data export has started (simulated).');
  };

  // Support/help
  const handleContactSupport = () => {
    message.info('Contacting support (simulated).');
  };

  return (
    <div style={{ padding: 24, minHeight: '80vh' }}>
      <Card style={{ maxWidth: 700, margin: '0 auto', borderRadius: 18, boxShadow: '0 4px 24px #e6f0ff', background: 'rgba(255,255,255,0.97)' }}>
        {/* User Profile Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
          <Avatar size={64} src={comunikcrm} style={{ background: '#277dfe' }} alt={user?.name || 'User'} />
          <div>
            <Typography.Title level={4} style={{ margin: 0, color: '#277dfe' }}>{user?.name || 'User Name'}</Typography.Title>
            <Typography.Text type="secondary">{user?.email || 'user@email.com'}</Typography.Text>
          </div>
        </div>
        <Divider />
        {/* Account Section */}
        <div style={{ marginBottom: 24 }}>
          <Typography.Title level={5} style={{ color: '#277dfe' }}>
            <UserOutlined /> Account
          </Typography.Title>
          <Button type="primary" style={{ marginRight: 12 }} onClick={() => setPasswordModalVisible(true)}>
            Change Password
          </Button>
          <Button onClick={() => setEmailModalVisible(true)}>Update Email</Button>
        </div>
        <Divider />
        {/* Session/Device Management */}
        <div style={{ marginBottom: 24 }}>
          <Typography.Title level={5} style={{ color: '#277dfe' }}>
            <MobileOutlined /> Active Sessions
          </Typography.Title>
          <List
            size="small"
            dataSource={sessions}
            renderItem={item => (
              <List.Item
                actions={item.current ? [<span style={{ color: '#389e0d', fontWeight: 600 }}>Current</span>] : [<Button size="small" type="link" icon={<LogoutOutlined />} danger>Logout</Button>]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<MobileOutlined />} style={{ background: '#e6f0ff', color: '#277dfe' }} />}
                  title={<span>{item.device}</span>}
                  description={<span>{item.location} &middot; Last active: {item.lastActive}</span>}
                />
              </List.Item>
            )}
          />
        </div>
        <Divider />
        {/* App Preferences */}
        <div style={{ marginBottom: 24 }}>
          <Typography.Title level={5} style={{ color: '#277dfe' }}>
            <CalendarOutlined /> Preferences
          </Typography.Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span>Date Format</span>
            <Button size="small" type={dateFormat === 'DD/MM/YYYY' ? 'primary' : 'default'} onClick={() => setDateFormat('DD/MM/YYYY')}>DD/MM/YYYY</Button>
            <Button size="small" type={dateFormat === 'MM/DD/YYYY' ? 'primary' : 'default'} onClick={() => setDateFormat('MM/DD/YYYY')}>MM/DD/YYYY</Button>
            <Tooltip title="Choose your preferred date format."><QuestionCircleOutlined style={{ color: '#888' }} /></Tooltip>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>Default Page</span>
            <Button size="small" type={defaultPage === 'Dashboard' ? 'primary' : 'default'} onClick={() => setDefaultPage('Dashboard')}>Dashboard</Button>
            <Button size="small" type={defaultPage === 'Profile' ? 'primary' : 'default'} onClick={() => setDefaultPage('Profile')}>Profile</Button>
            <Tooltip title="Choose which page you see after login."><QuestionCircleOutlined style={{ color: '#888' }} /></Tooltip>
          </div>
        </div>
        <Divider />
        {/* Notifications */}
        <div style={{ marginBottom: 24 }}>
          <Typography.Title level={5} style={{ color: '#277dfe' }}>
            <BellOutlined /> Notifications
          </Typography.Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>Email Notifications</span>
            <Switch checked={emailNotifications} onChange={checked => {
              setEmailNotifications(checked);
              message.success(`Email notifications ${checked ? 'enabled' : 'disabled'}`);
            }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
            <span>SMS Notifications</span>
            <Switch checked={smsNotifications} onChange={checked => {
              setSmsNotifications(checked);
              message.success(`SMS notifications ${checked ? 'enabled' : 'disabled'}`);
            }} />
          </div>
        </div>
        <Divider />
        {/* Appearance */}
        <div style={{ marginBottom: 24 }}>
          <Typography.Title level={5} style={{ color: '#277dfe' }}>
            <SettingOutlined /> Appearance
          </Typography.Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span>Theme</span>
            <Button onClick={() => setThemeModalVisible(true)}>{theme === 'light' ? 'Light' : 'Dark'} Mode</Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>Language</span>
            <Button onClick={() => setLanguageModalVisible(true)}>{currentLanguage}</Button>
          </div>
        </div>
        <Divider />
        {/* Security */}
        <div style={{ marginBottom: 24 }}>
          <Typography.Title level={5} style={{ color: '#277dfe' }}>
            <LockOutlined /> Security
          </Typography.Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>Two-Factor Authentication (2FA)</span>
            <Switch checked={is2FAEnabled} onChange={checked => {
              set2FAEnabled(checked);
              message.success(`2FA ${checked ? 'enabled' : 'disabled'}`);
            }} />
          </div>
        </div>
        <Divider />
        {/* Data Export & Support */}
        <div style={{ marginBottom: 24, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <Typography.Title level={5} style={{ color: '#277dfe' }}>
              <DownloadOutlined /> Data Export
            </Typography.Title>
            <Button icon={<ExportOutlined />} onClick={handleExportData} style={{ marginTop: 4 }}>Download My Data</Button>
          </div>
          <div style={{ flex: 1 }}>
            <Typography.Title level={5} style={{ color: '#277dfe' }}>
              <QuestionCircleOutlined /> Support & Help
            </Typography.Title>
            <Button icon={<QuestionCircleOutlined />} onClick={handleContactSupport} style={{ marginTop: 4 }}>Contact Support</Button>
          </div>
        </div>
        <Divider />
        {/* Privacy */}
        <div>
          <Typography.Title level={5} style={{ color: '#277dfe' }}>
            <LockOutlined /> Privacy
          </Typography.Title>
          <Popconfirm
            title="Are you sure you want to delete your account? This action cannot be undone."
            onConfirm={handleDeleteAccount}
            okText="Yes, delete"
            cancelText="Cancel"
          >
            <Button danger>Delete Account</Button>
          </Popconfirm>
        </div>
      </Card>
      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={isPasswordModalVisible}
        onOk={handlePasswordOk}
        onCancel={() => setPasswordModalVisible(false)}
        okText="Change"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[{ required: true, message: 'Please enter your current password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[{ required: true, message: 'Please enter a new password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
      {/* Update Email Modal */}
      <Modal
        title="Update Email"
        open={isEmailModalVisible}
        onOk={handleEmailOk}
        onCancel={() => setEmailModalVisible(false)}
        okText="Update"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="New Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your new email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {/* Theme Modal */}
      <Modal
        title="Select Theme"
        open={isThemeModalVisible}
        onOk={() => setThemeModalVisible(false)}
        onCancel={() => setThemeModalVisible(false)}
        okText="Close"
        cancelText="Cancel"
        footer={null}
      >
        <Button
          type={theme === 'light' ? 'primary' : 'default'}
          onClick={() => { setTheme('light'); message.success('Light mode enabled!'); }}
          style={{ marginRight: 12 }}
        >
          Light Mode
        </Button>
        <Button
          type={theme === 'dark' ? 'primary' : 'default'}
          onClick={() => { setTheme('dark'); message.success('Dark mode enabled!'); }}
        >
          Dark Mode
        </Button>
      </Modal>
      {/* Language Modal */}
      <Modal
        title="Select Language"
        open={isLanguageModalVisible}
        onOk={() => setLanguageModalVisible(false)}
        onCancel={() => setLanguageModalVisible(false)}
        okText="Close"
        cancelText="Cancel"
        footer={null}
      >
        <Button
          type={currentLanguage === 'English' ? 'primary' : 'default'}
          onClick={() => setLanguage('English')}
          style={{ marginRight: 12 }}
        >
          English
        </Button>
        <Button
          type={currentLanguage === 'French' ? 'primary' : 'default'}
          onClick={() => setLanguage('French')}
        >
          French
        </Button>
      </Modal>
    </div>
  );
};

export default SettingsPage;
