import { MessageOutlined, NotificationOutlined, UserOutlined, BellOutlined } from '@ant-design/icons';
import { Avatar, Flex, Dropdown, Menu, Card, Button, Badge, List, notification, Modal, Divider } from 'antd';
import Typography from 'antd/es/typography/Typography';
import React, { useEffect, useState } from 'react';
import comunikcrm from '../assets/comunikcrm.png';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import axios from '../axios';

const CostumHeader = () => {
  const { setToken } = useStateContext();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [eventNotifications, setEventNotifications] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [popupEvent, setPopupEvent] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    let intervalId;

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) {
          console.error('No access token found');
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/employees', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const currentUser = response.data.find(emp => emp.id === parseInt(localStorage.getItem('USER_ID')));
        if (currentUser) {
          const { id, name, email, phone_number, address, sos_number, social_situation, department } = currentUser;
          setUser({
            id,
            name,
            email,
            phone: phone_number || 'Phone not provided',
            address: address || 'Address not provided',
            sosNumber: sos_number || 'SOS Number not provided',
            socialSituation: social_situation || 'Social Situation not provided',
            department: department || 'Department not provided',
          });
        } else {
          console.error('Current user not found in employees list');
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/events');
        const events = response.data;
        setEventNotifications(events);

        let shownEventIds = JSON.parse(localStorage.getItem('SHOWN_EVENT_IDS') || '[]');
        let shownEndedIds = JSON.parse(localStorage.getItem('SHOWN_ENDED_EVENT_IDS') || '[]');
        const now = new Date();
        const notifShownOnLogin = sessionStorage.getItem('NOTIF_SHOWN_ON_LOGIN');

        const newEvents = events.filter(e => !shownEventIds.includes(e.id));
        const newlyEnded = events.filter(e => e.end_date && new Date(e.end_date) < now && !shownEndedIds.includes(e.id));

        // Only show popup if NOTIF_SHOWN_ON_LOGIN is not set (first load in session)
        if (!notifShownOnLogin && (newEvents.length > 0 || newlyEnded.length > 0)) {
          let popup = null;
          if (newEvents.length > 0) {
            popup = {
              type: 'new',
              event: newEvents[0],
              count: newEvents.length
            };
          } else if (newlyEnded.length > 0) {
            popup = {
              type: 'ended',
              event: newlyEnded[0],
              count: newlyEnded.length
            };
          }
          if (popup) {
            notification.destroy();
            notification.open({
              key: `${popup.type}-${popup.event.id}-${popup.event.start_date}`,
              message: popup.type === 'new'
                ? (popup.count > 1 ? `Nouvel événement (+${popup.count - 1} more)` : 'Nouvel événement')
                : (popup.count > 1 ? `Event Ended (+${popup.count - 1} more)` : 'Event Ended'),
              description: popup.type === 'new'
                ? `${popup.event.title} - ${popup.event.start_date}`
                : `The event "${popup.event.title}" has ended.`,
              duration: 4,
            });
            sessionStorage.setItem('NOTIF_SHOWN_ON_LOGIN', '1');
            console.log('[Notification Popup] Popup shown and sessionStorage NOTIF_SHOWN_ON_LOGIN set to 1');
          }
        } else {
          console.log('[Notification Popup] Popup not shown. sessionStorage NOTIF_SHOWN_ON_LOGIN:', notifShownOnLogin);
        }
        // Always update shown IDs in localStorage
        if (newEvents.length > 0) {
          shownEventIds = [...shownEventIds, ...newEvents.map(e => e.id)];
          localStorage.setItem('SHOWN_EVENT_IDS', JSON.stringify(shownEventIds));
        }
        if (newlyEnded.length > 0) {
          shownEndedIds = [...shownEndedIds, ...newlyEnded.map(e => e.id)];
          localStorage.setItem('SHOWN_ENDED_EVENT_IDS', JSON.stringify(shownEndedIds));
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchUser();
    fetchEvents();
    intervalId = setInterval(fetchEvents, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Reset NOTIF_SHOWN_ON_LOGIN on login/logout
  useEffect(() => {
    // Only reset the flag on logout, not on every mount
    // sessionStorage.removeItem('NOTIF_SHOWN_ON_LOGIN');
  }, []);

  console.log('User Data:', user); // Debugging: Log the user data to verify if it is being fetched correctly

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('ACCESS_TOKEN');
    sessionStorage.removeItem('NOTIF_SHOWN_ON_LOGIN');
    console.log('[Notification Popup] sessionStorage NOTIF_SHOWN_ON_LOGIN cleared on logout');
    navigate('/login');
  };

  const handleNotificationClick = (event) => {
    setPopupEvent(event);
    setPopupVisible(true);
  };

  const menu = (
    <Card style={{ padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}> {/* Added box styling */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Avatar size={64} style={{ backgroundColor: '#1890ff', fontSize: '24px' }}>
          {user.name ? user.name.charAt(0).toUpperCase() : '?'}
        </Avatar>
        <Typography.Title level={5} style={{ margin: '10px 0' }}>{user.name || 'User Name'}</Typography.Title>
        <Typography.Text type="secondary">{user.email || 'user@example.com'}</Typography.Text>
      </div>
      <div style={{ borderTop: '1px solid #f0f0f0', margin: '20px 0' }}></div> {/* Added line between sections */}
      <Button type="link" block onClick={() => navigate('/profile')} style={{ textAlign: 'left', marginBottom: '10px' }}>
        Manage your Profile
      </Button>
      <Button type="link" block onClick={() => navigate('/settings')} style={{ textAlign: 'left', marginBottom: '10px' }}>
        Settings
      </Button>
      <div style={{ borderTop: '1px solid #f0f0f0', margin: '20px 0' }}></div> {/* Added line before logout */}
      <Button type="link" block onClick={handleLogout} style={{ textAlign: 'left', color: 'red' }}>
        Sign out
      </Button>
    </Card>
  );

  const notificationMenu = (
    <Card style={{ width: 260, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', maxHeight: 420, padding: 0, overflowY: 'auto', background: '#f9fbff' }}>
      <Typography.Title level={5} style={{ margin: '12px 0 8px 16px', color: '#277dfe', fontWeight: 700, fontSize: 16 }}>Notifications</Typography.Title>
      {loadingEvents ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={[...eventNotifications].sort((a, b) => new Date(b.start_date) - new Date(a.start_date))}
          renderItem={(item) => (
            <List.Item style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }} onClick={() => handleNotificationClick(item)}>
              <List.Item.Meta
                avatar={<Avatar size={32} style={{ background: '#277dfe', fontWeight: 600 }}>{item.title ? item.title.charAt(0) : '?'}</Avatar>}
                title={<span style={{ fontWeight: 600, fontSize: 14, color: '#222' }}>{item.title}</span>}
                description={
                  <div>
                    {item.start_date && <div style={{ fontSize: 12, color: '#888' }}>Date: {item.start_date}</div>}
                    {item.users && item.users.length > 0 && (
                      <div style={{ marginTop: 4 }}>
                        <span style={{ fontWeight: 500, fontSize: 12, color: '#555' }}>Assigned:</span>
                        <div style={{ display: 'flex', gap: 4, marginTop: 2, flexWrap: 'wrap' }}>
                          {item.users.map(user => (
                            <span key={user.id} style={{ display: 'flex', alignItems: 'center', marginRight: 6 }}>
                              <Avatar size={18} src={user.avatar} style={{ marginRight: 2, background: '#e6f0ff', color: '#277dfe', fontSize: 11 }}>
                                {user.name ? user.name.charAt(0) : '?'}
                              </Avatar>
                              <span style={{ fontSize: 11, color: '#555' }}>{user.name}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
      <div style={{ textAlign: 'center', margin: '8px 0 4px 0' }}>
        <a href="#" style={{ color: '#277dfe', fontSize: 13 }}>See all recent activity</a>
      </div>
    </Card>
  );

  return (
    <>
      <Flex align='center' style={{ backgroundColor: '#fff', padding: '10px', boxShadow: '0 2px 8px  rgb(0, 0, 0)' }}> {/* Updated background color to match sidebar */}
        <Typography.Title level={4} type='secondary'>
          <img src={comunikcrm} width="120" alt="Logo" />
        </Typography.Title>
        <Flex align='center' gap='3rem' style={{ marginLeft: 'auto' }}>
          <Dropdown overlay={notificationMenu} placement="bottomRight" trigger={['click']}>
            <Badge count={eventNotifications.length} offset={[10, 0]}>
              <Avatar size={40} icon={<BellOutlined />} style={{  cursor: 'pointer' }} />
            </Badge>
          </Dropdown>
          <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
            <Avatar size={40} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', cursor: 'pointer' }} />
          </Dropdown>
        </Flex>
      </Flex>
      <Modal
        title={popupEvent ? popupEvent.title : ''}
        open={popupVisible}
        onCancel={() => setPopupVisible(false)}
        footer={null}
        bodyStyle={{ borderRadius: 10, background: '#f9fbff', padding: 24 }}
        style={{ top: 60 }}
      >
        {popupEvent && (
          <div style={{ minWidth: 320 }}>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontWeight: 600, color: '#277dfe', fontSize: 15 }}>Date:</span>
              <span style={{ marginLeft: 8, color: '#333', fontSize: 14 }}>{popupEvent.start_date}</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontWeight: 600, color: '#277dfe', fontSize: 15 }}>Description:</span>
              <span style={{ marginLeft: 8, color: '#333', fontSize: 14 }}>{popupEvent.description}</span>
            </div>
            <Divider style={{ margin: '16px 0' }} />
            <div style={{ marginBottom: 8, fontWeight: 600, color: '#277dfe', fontSize: 15 }}>Users Assigned:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {(popupEvent.users && popupEvent.users.length > 0 ? popupEvent.users : popupEvent.participants && popupEvent.participants.length > 0 ? popupEvent.participants : []).length > 0 ? (
                (popupEvent.users && popupEvent.users.length > 0 ? popupEvent.users : popupEvent.participants).map(user => (
                  <div key={user.id} style={{ display: 'flex', alignItems: 'center', background: '#e6f0ff', borderRadius: 6, padding: '4px 10px', marginBottom: 4 }}>
                    <Avatar size={28} src={user.avatar} style={{ marginRight: 8, background: '#fff', color: '#277dfe', fontWeight: 600 }}>
                      {user.name ? user.name.charAt(0) : '?'}
                    </Avatar>
                    <span style={{ fontSize: 13, color: '#222', fontWeight: 500 }}>{user.name}</span>
                  </div>
                ))
              ) : (
                <span style={{ fontSize: 13, color: '#aaa' }}>No users assigned</span>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default CostumHeader;