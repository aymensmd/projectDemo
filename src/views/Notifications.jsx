import React, { useState } from 'react';
import { Typography, Card, List, Button, Tag, Space, Badge } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const initialNotifications = [
  { id: 1, title: 'New Policy Update', desc: 'Holiday policy updated', type: 'info', read: false },
  { id: 2, title: 'Project Deadline', desc: 'Project X due in 3 days', type: 'warning', read: false },
  { id: 3, title: 'Survey Invitation', desc: 'Please complete the pulse survey', type: 'default', read: true },
];

const Notifications = () => {
  const [items, setItems] = useState(initialNotifications);
  const unread = items.filter(i => !i.read).length;

  const markAllRead = () => setItems(items.map(i => ({ ...i, read: true })));
  const toggleRead = (id) => setItems(items.map(i => i.id === id ? { ...i, read: !i.read } : i));

  return (
    <div style={{ padding: 24 }}>
  <Title level={2}><BellOutlined /> Notifications <Badge count={unread} style={{ backgroundColor: '#52c41a' }} /></Title>
      <Paragraph>All your system and HR notifications will appear here.</Paragraph>
      <Card style={{ marginTop: 16 }}>
        <Space style={{ marginBottom: 12 }}>
          <Button onClick={markAllRead}>Mark all read</Button>
        </Space>
        <List
          dataSource={items}
          renderItem={item => (
            <List.Item actions={[<Button type="link" onClick={() => toggleRead(item.id)}>{item.read ? 'Mark unread' : 'Mark read'}</Button>]}
              style={{ background: item.read ? '#fafafa' : '#fff' }}
            >
              <List.Item.Meta
                title={<span>{item.title} {item.read ? <Tag color="default">Read</Tag> : <Tag color="processing">New</Tag>}</span>}
                description={item.desc}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Notifications;
