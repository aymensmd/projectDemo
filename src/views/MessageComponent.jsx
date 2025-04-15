import React, { useState } from 'react';
import { Layout, Menu, List, Input, Button, Row, Col } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

const MessageComponent = () => {
  const [messages, setMessages] = useState(["Message 1"]);

  const [newMessage, setNewMessage] = useState("");

  const handleChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSend = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, newMessage]);
      setNewMessage("");
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="1">User 1</Menu.Item>
          <Menu.Item key="2">User 2</Menu.Item>
          <Menu.Item key="3">User 3</Menu.Item>
          <Menu.Item key="4">User 4</Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ padding: '24px 24px 0' }}>
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          <List
            bordered
            dataSource={messages}
            renderItem={item => <List.Item>{item}</List.Item>}
          />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          <Row gutter={16} justify="center">
            <Col>
              <Input.TextArea
                value={newMessage}
                onChange={handleChange}
                placeholder="Type a message"
                autoSize={{ minRows: 2, maxRows: 4 }}
                style={{ width: '100%' }}
              />
            </Col>
            <Col>
              <Button type="primary" onClick={handleSend}>Send</Button>
            </Col>
          </Row>
        </Footer>
      </Layout>
    </Layout>
  );
}

export default MessageComponent;
