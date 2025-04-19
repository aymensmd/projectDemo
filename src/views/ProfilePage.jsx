import React, { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Button, Row, Col, Menu, List, Spin, Empty, Modal, Upload, message } from 'antd';
import { InfoCircleOutlined, HistoryOutlined, ClockCircleOutlined, UserOutlined, PhoneOutlined, HomeOutlined, MailOutlined, SafetyCertificateOutlined, HeartOutlined, CalendarTwoTone, EditOutlined, InboxOutlined, FilePdfOutlined, PlusOutlined } from '@ant-design/icons';
import axios from '../axios';

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [activeTab, setActiveTab] = useState('information');
  const [eventHistory, setEventHistory] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [profileStats, setProfileStats] = useState({ totalEvents: 0, ongoingEvents: 0 });
  const [quote, setQuote] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editableQuote, setEditableQuote] = useState(quote);
  const [loadingUser, setLoadingUser] = useState(true);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [vacations, setVacations] = useState([]);
  const [loadingVacations, setLoadingVacations] = useState(false);
  const avatarColor = '#1890ff';

  const uploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      setUploadedFile(file);
      message.success(`${file.name} file selected.`);
      return false; // Prevent auto upload
    },
  };

  const handleMenuClick = (e) => {
    setActiveTab(e.key);
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      try {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) {
          console.error('No access token found');
          setLoadingUser(false);
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/employees', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const currentUser = response.data.find(emp => emp.id === parseInt(localStorage.getItem('USER_ID')));
        if (currentUser) {
          const { id, name, email, phone_number, adress, sos_number, social_situation, department, created_at, last_login } = currentUser;
          setUser({
            id,
            name,
            email,
            phone: phone_number || 'Phone not provided',
            address: adress || 'Address not provided',
            sosNumber: sos_number || 'SOS Number not provided',
            socialSituation: social_situation || 'Social Situation not provided',
            department: department || 'Department not provided',
            created_at,
            last_login,
          });
        } else {
          console.error('Current user not found in employees list');
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      } finally {
        setLoadingUser(false);
      }
    };

    const fetchUserEvents = async (userId) => {
      setLoadingEvents(true);
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/events');
        const userEvents = response.data.filter(event => {
          const users = event.users || event.participants || [];
          return users.some(u => u.id === userId);
        });
        setEventHistory(userEvents);
      } catch (error) {
        setEventHistory([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    const fetchUserVacations = async (userId) => {
      setLoadingVacations(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/vacations/${userId}`);
        setVacations(response.data);
      } catch (error) {
        setVacations([]);
      } finally {
        setLoadingVacations(false);
      }
    };

    fetchUser().then(() => {
      if (localStorage.getItem('USER_ID')) {
        const userId = parseInt(localStorage.getItem('USER_ID'));
        fetchUserEvents(userId);
        fetchUserVacations(userId);
      }
    });
    // Motivational quote (static or could be fetched from API)
    setQuote('Success is not the key to happiness. Happiness is the key to success.');
  }, []);

  useEffect(() => {
    setEditableQuote(quote);
  }, [quote]);

  useEffect(() => {
    // Calculate profile stats when eventHistory changes
    const totalEvents = eventHistory.length;
    const ongoingEvents = eventHistory.filter(e => !e.end_date || new Date(e.end_date) >= new Date()).length;
    setProfileStats({ totalEvents, ongoingEvents });
  }, [eventHistory]);

  const handleEditProfile = () => {
    setIsModalVisible(true);
  };

  const handleSaveProfile = () => {
    setQuote(editableQuote);
    setIsModalVisible(false);
  };

  const handleCancelEdit = () => {
    setEditableQuote(quote);
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: '20px', minHeight: '80vh', position: 'relative' }}>
      {/* Upload + icon at top right */}
      <div style={{ position: 'absolute', top: 24, right: 32, zIndex: 10 }}>
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined style={{ fontSize: 22 }} />}
          size="large"
          onClick={() => setIsUploadModalVisible(true)}
          title="Upload Resume/File"
        />
      </div>
      {/* Upload Modal */}
      <Modal
        title="Resume / File Upload"
        visible={isUploadModalVisible}
        onCancel={() => setIsUploadModalVisible(false)}
        footer={null}
        centered
      >
        <Card
          style={{ background: '#fff', border: '1px solid #e6f7ff', borderRadius: 8, boxShadow: '0 1px 4px #e6f0ff', textAlign: 'center', maxWidth: 320, margin: '0 auto' }}
          bodyStyle={{ padding: 12 }}
        >
          <div style={{ marginBottom: 2 }}>
            <FilePdfOutlined style={{ fontSize: 16, color: '#277dfe' }} />
          </div>
          <Typography.Title level={5} style={{ color: '#277dfe', marginBottom: 0, fontSize: 12 }}>
            Resume / File Upload
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 10 }}>
            {uploadedFile ? (
              <span>Uploaded: <b>{uploadedFile.name}</b></span>
            ) : (
              'No file uploaded yet.'
            )}
          </Typography.Text>
          <div style={{ marginTop: 6 }}>
            <Upload.Dragger {...uploadProps} style={{ background: '#f0f5ff', borderRadius: 6, minHeight: 48, padding: 4 }}>
              <p className="ant-upload-drag-icon" style={{ marginBottom: 2 }}>
                <InboxOutlined style={{ color: '#277dfe', fontSize: 14 }} />
              </p>
              <p className="ant-upload-text" style={{ fontSize: 10, marginBottom: 1 }}>Click or drag file</p>
              <p className="ant-upload-hint" style={{ fontSize: 9 }}>PDF, DOC, DOCX, or image files.</p>
            </Upload.Dragger>
          </div>
        </Card>
      </Modal>
      {loadingUser ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Spin size="large" tip="Loading profile..." />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card style={{ padding: '20px' }}>
              <Card style={{ marginBottom: 16, background: '#f6ffed', border: 'none', boxShadow: '0 2px 8px #e6f0ff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Avatar
                    size={80}
                    style={{ backgroundColor: avatarColor, fontSize: '32px', transition: 'background 0.3s' }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                  </Avatar>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Typography.Title level={2} style={{ margin: 0, fontSize: '2.2em' }}>{user.name || 'Name not provided'}</Typography.Title>
                    </div>
                    <Typography.Text type="secondary">{user.department || 'Department not provided'}</Typography.Text>
                  </div>
                </div>
              </Card>
              <div style={{ margin: '18px 0 8px 0', display: 'flex', gap: 8 }}>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEditProfile}
                  style={{ fontWeight: 600, letterSpacing: 1 }}
                  block
                >
                  Edit Profile
                </Button>
              </div>
              <Card size="small" style={{ background: '#f6ffed', border: 'none', marginBottom: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span><CalendarTwoTone /> <b>Joined:</b> {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
                  <span><ClockCircleOutlined /> <b>Last Login:</b> {user.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}</span>
                </div>
              </Card>
              <Card size="small" style={{ background: '#e6f7ff', border: 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span><HistoryOutlined style={{ color: '#faad14' }} /> <b>Total Events:</b> {profileStats.totalEvents}</span>
                  <span><ClockCircleOutlined style={{ color: '#389e0d' }} /> <b>Ongoing:</b> {profileStats.ongoingEvents}</span>
                </div>
              </Card>
              <Card size="small" style={{ background: '#fffbe6', border: 'none', marginTop: 10 }}>
                <Typography.Text italic style={{ color: '#faad14' }}>
                  "{quote}"
                </Typography.Text>
              </Card>
            </Card>
            <Modal
              title="Edit Motivation Message"
              visible={isModalVisible}
              onOk={handleSaveProfile}
              onCancel={handleCancelEdit}
              okText="Save"
              cancelText="Cancel"
            >
              <label style={{ fontWeight: 500, color: '#faad14' }}>
                Motivation Message:
                <input
                  type="text"
                  value={editableQuote}
                  onChange={e => setEditableQuote(e.target.value)}
                  style={{ marginLeft: 10, width: '80%' }}
                  maxLength={120}
                />
              </label>
            </Modal>
          </Col>
          <Col xs={24} md={16}>
            <Card style={{ padding: '20px', marginBottom: '20px' }}>
              <Menu onClick={handleMenuClick} selectedKeys={[activeTab]} mode="horizontal">
                <Menu.Item key="information" icon={<InfoCircleOutlined />}>
                  Information
                </Menu.Item>
                <Menu.Item key="history" icon={<HistoryOutlined />}>
                  History
                </Menu.Item>
              </Menu>
            </Card>
            {activeTab === 'information' && (
              <Card style={{ padding: '20px', background: '#f0f5ff', borderRadius: 12, boxShadow: '0 2px 8px #e6f0ff' }}>
                <Typography.Title level={5} style={{ marginBottom: '20px', color: '#277dfe', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <InfoCircleOutlined style={{ color: '#277dfe' }} /> Personal Information
                </Typography.Title>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px 32px',
                  marginBottom: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <UserOutlined style={{ color: '#1890ff', fontSize: 18 }} />
                    <div>
                      <Typography.Text strong style={{ color: '#277dfe' }}>Name:</Typography.Text>
                      <div style={{ color: '#222' }}>{user.name || 'Name not provided'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <InfoCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                    <div>
                      <Typography.Text strong style={{ color: '#277dfe' }}>Department:</Typography.Text>
                      <div style={{ color: '#222' }}>{user.department || 'Department not provided'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <PhoneOutlined style={{ color: '#faad14', fontSize: 18 }} />
                    <div>
                      <Typography.Text strong style={{ color: '#277dfe' }}>Phone:</Typography.Text>
                      <div style={{ color: '#222' }}>{user.phone || 'Phone not provided'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <HomeOutlined style={{ color: '#13c2c2', fontSize: 18 }} />
                    <div>
                      <Typography.Text strong style={{ color: '#277dfe' }}>Address:</Typography.Text>
                      <div style={{ color: '#222' }}>{user.address || 'Address not provided'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <MailOutlined style={{ color: '#722ed1', fontSize: 18 }} />
                    <div>
                      <Typography.Text strong style={{ color: '#277dfe' }}>Email:</Typography.Text>
                      <div style={{ color: '#222' }}>{user.email || 'Email not provided'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <SafetyCertificateOutlined style={{ color: '#eb2f96', fontSize: 18 }} />
                    <div>
                      <Typography.Text strong style={{ color: '#277dfe' }}>SOS Number:</Typography.Text>
                      <div style={{ color: '#222' }}>{user.sosNumber || 'SOS Number not provided'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <HeartOutlined style={{ color: '#cf1322', fontSize: 18 }} />
                    <div>
                      <Typography.Text strong style={{ color: '#277dfe' }}>Social Situation:</Typography.Text>
                      <div style={{ color: '#222' }}>{user.socialSituation || 'Social Situation not provided'}</div>
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <Typography.Title level={5} style={{ color: '#277dfe', marginBottom: 6 }}>Skills & Interests</Typography.Title>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ background: '#e6f7ff', color: '#277dfe', borderRadius: 6, padding: '2px 10px', fontSize: 13 }}>Teamwork</span>
                    <span style={{ background: '#fff1b8', color: '#faad14', borderRadius: 6, padding: '2px 10px', fontSize: 13 }}>Communication</span>
                    <span style={{ background: '#ffd6e7', color: '#eb2f96', borderRadius: 6, padding: '2px 10px', fontSize: 13 }}>Problem Solving</span>
                    <span style={{ background: '#f6ffed', color: '#389e0d', borderRadius: 6, padding: '2px 10px', fontSize: 13 }}>Creativity</span>
                  </div>
                </div>
              </Card>
            )}
            {activeTab === 'history' && (
              <Card style={{ padding: '20px', background: '#fffbe6', borderRadius: 12, boxShadow: '0 2px 8px #ffe58f' }}>
                <Typography.Title level={5} style={{ marginBottom: '20px', color: '#faad14', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <HistoryOutlined style={{ color: '#faad14' }} /> History
                </Typography.Title>
                <Typography.Title level={5} style={{ color: '#277dfe', marginTop: 0, marginBottom: 10, fontSize: 16 }}>Events</Typography.Title>
                {loadingEvents ? (
                  <Spin />
                ) : eventHistory.length === 0 ? (
                  <Empty description="No events assigned" />
                ) : (
                  <List
                    itemLayout="horizontal"
                    dataSource={eventHistory}
                    renderItem={item => (
                      <List.Item style={{ background: '#fff', borderRadius: 8, marginBottom: 10, boxShadow: '0 1px 4px #f0f0f0', padding: 16 }}>
                        <List.Item.Meta
                          avatar={<Avatar style={{ background: '#277dfe' }} icon={<ClockCircleOutlined />} />}
                          title={<span style={{ fontWeight: 600, color: '#277dfe', fontSize: 15 }}><CalendarTwoTone /> {item.title}</span>}
                          description={
                            <div style={{ fontSize: 13 }}>
                              <div style={{ marginBottom: 4 }}>
                                <span style={{ color: '#faad14', fontWeight: 500 }}><ClockCircleOutlined /> Date:</span> <span style={{ color: '#222' }}>{item.start_date}</span>
                              </div>
                              <div style={{ color: '#555', marginBottom: 4 }}>
                                <span style={{ color: '#722ed1', fontWeight: 500 }}><InfoCircleOutlined /> Description:</span> {item.description && item.description.length > 60 ? item.description.slice(0, 60) + '...' : item.description}
                              </div>
                              <div style={{ fontWeight: 500, marginBottom: 4, color: item.end_date && new Date(item.end_date) < new Date() ? '#cf1322' : '#389e0d' }}>
                                <span style={{ color: item.end_date && new Date(item.end_date) < new Date() ? '#cf1322' : '#389e0d' }}><HistoryOutlined /> Status:</span> {item.end_date && new Date(item.end_date) < new Date() ? 'Ended' : 'Ongoing'}
                              </div>
                              <div style={{ fontWeight: 500, color: '#277dfe', marginBottom: 2 }}>
                                <UserOutlined /> Assigned Users:
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                                {(Array.isArray(item.users) && item.users.length > 0
                                  ? item.users
                                  : Array.isArray(item.participants) && item.participants.length > 0
                                    ? item.participants
                                    : []
                                ).length > 0
                                  ? (Array.isArray(item.users) && item.users.length > 0
                                      ? item.users
                                      : item.participants
                                    ).map(u => (
                                      <span key={u.id || u.email} style={{ display: 'flex', alignItems: 'center', background: '#e6f0ff', borderRadius: 6, padding: '2px 8px', marginBottom: 2 }}>
                                        <Avatar size={18} style={{ marginRight: 6, background: '#fff', color: '#277dfe', fontWeight: 600, fontSize: 11 }}>
                                          {u.name ? u.name.charAt(0) : (u.email ? u.email.charAt(0) : '?')}
                                        </Avatar>
                                        <span style={{ fontSize: 12, color: '#222', fontWeight: 500 }}>{u.name || u.email || 'Unknown'}</span>
                                        {u.department && <span style={{ fontSize: 11, color: '#52c41a', marginLeft: 6 }}><InfoCircleOutlined /> {u.department}</span>}
                                      </span>
                                    ))
                                  : <span style={{ fontSize: 12, color: '#aaa' }}>No users assigned</span>
                                }
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
                <Typography.Title level={5} style={{ color: '#277dfe', marginTop: 24, marginBottom: 10, fontSize: 16 }}>Vacations</Typography.Title>
                {loadingVacations ? (
                  <Spin />
                ) : vacations.length === 0 ? (
                  <Empty description="No vacations found" />
                ) : (
                  <List
                    itemLayout="horizontal"
                    dataSource={vacations}
                    renderItem={vac => (
                      <List.Item style={{ background: '#fff', borderRadius: 8, marginBottom: 10, boxShadow: '0 1px 4px #f0f0f0', padding: 16 }}>
                        <List.Item.Meta
                          avatar={<Avatar style={{ background: '#faad14' }} icon={<CalendarTwoTone />} />}
                          title={<span style={{ fontWeight: 600, color: '#faad14', fontSize: 15 }}>Vacation: {vac.type || 'N/A'}</span>}
                          description={
                            <div style={{ fontSize: 13 }}>
                              <div style={{ marginBottom: 4 }}>
                                <span style={{ color: '#faad14', fontWeight: 500 }}>From:</span> <span style={{ color: '#222' }}>{vac.start_date}</span>
                              </div>
                              <div style={{ marginBottom: 4 }}>
                                <span style={{ color: '#faad14', fontWeight: 500 }}>To:</span> <span style={{ color: '#222' }}>{vac.end_date}</span>
                              </div>
                              <div style={{ color: '#555', marginBottom: 4 }}>
                                <span style={{ color: '#722ed1', fontWeight: 500 }}>Reason:</span> {vac.reason && vac.reason.length > 60 ? vac.reason.slice(0, 60) + '...' : vac.reason}
                              </div>
                              <div style={{ fontWeight: 500, color: '#277dfe', marginBottom: 2 }}>
                                <UserOutlined /> Status: {vac.status || 'N/A'}
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            )}
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ProfilePage;