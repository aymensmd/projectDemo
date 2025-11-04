import React, { useState } from 'react';
import { Card, List, Button, Modal, Input, Form, message } from 'antd';
import PageContainer from '../components/PageContainer';

const faqs = [
  { q: 'How do I reset my password?', a: 'Go to Settings > Security and choose Reset Password.' },
  { q: 'How can I add a new employee?', a: 'Navigate to Users > Add Employee and fill the required fields.' },
  { q: 'How do I export reports?', a: 'Reports > Export allows CSV/PDF exports with date range filters.' },
];

const HelpCenter = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form] = Form.useForm();

  const submit = (vals) => {
    message.success('Support request submitted');
    form.resetFields();
  };

  return (
    <PageContainer title="Help Center">
      <h3>Frequently Asked Questions</h3>
      <List dataSource={faqs} renderItem={f => (
        <List.Item onClick={() => { setSelected(f); setOpen(true); }} style={{ cursor: 'pointer' }}>
          <List.Item.Meta title={f.q} description={f.a.slice(0, 80) + '...'} />
        </List.Item>
      )} />

      <h3 style={{ marginTop: 20 }}>Contact Support</h3>
      <Form form={form} layout="vertical" onFinish={submit}>
        <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Send</Button>
        </Form.Item>
      </Form>

      <Modal visible={open} title={selected?.q} onCancel={() => setOpen(false)} footer={null}>
        <p>{selected?.a}</p>
      </Modal>
    </PageContainer>
  );
};

export default HelpCenter;

