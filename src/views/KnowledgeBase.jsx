import React, { useState } from 'react';
import { Input, List, Modal } from 'antd';
import PageContainer from '../components/PageContainer';

const docs = [
  { id: 1, title: 'How to request leave', body: 'To request leave, go to Vacation > New Request and fill the form. Attach any supporting documents and submit for manager approval.' },
  { id: 2, title: 'How to run payroll', body: 'Payroll runs at the end of the month. Ensure employee hours are approved and all timesheets are locked before payroll processing.' },
  { id: 3, title: 'Setting up two-factor auth', body: 'Go to Settings > Security and enable 2FA. We support Authenticator apps like Google Authenticator or Authy.' },
];

const KnowledgeBase = () => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const filtered = docs.filter(d => d.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <PageContainer title="Knowledge Base">
      <Input placeholder="Search articles" value={query} onChange={e => setQuery(e.target.value)} style={{ marginBottom: 12 }} />
      <List
        dataSource={filtered}
        renderItem={d => (
          <List.Item onClick={() => { setActive(d); setOpen(true); }} style={{ cursor: 'pointer' }}>
            <List.Item.Meta title={d.title} description={d.body.slice(0, 100) + '...'} />
          </List.Item>
        )}
      />

      <Modal visible={open} title={active?.title} onCancel={() => setOpen(false)} footer={null}>
        <p>{active?.body}</p>
      </Modal>
    </PageContainer>
  );
};

export default KnowledgeBase;
