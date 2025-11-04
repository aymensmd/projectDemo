import React, { useState } from 'react';
import { Typography, Card, List, Button, Modal, Radio, message } from 'antd';

const { Title } = Typography;

const mockSurveys = [
  { id: 1, title: 'Employee Engagement', questions: ['Satisfied with work-life balance?'] },
  { id: 2, title: 'Workplace Safety', questions: ['Do you feel safe at workplace?'] }
];

const Surveys = () => {
  const [openSurvey, setOpenSurvey] = useState(null);
  const [answer, setAnswer] = useState(null);

  const take = (survey) => setOpenSurvey(survey);
  const submit = () => {
    message.success('Survey submitted — thanks!');
    setOpenSurvey(null);
    setAnswer(null);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Surveys</Title>
      <Card style={{ marginTop: 16 }}>
        <List
          dataSource={mockSurveys}
          renderItem={s => (
            <List.Item actions={[<Button onClick={() => take(s)}>Take Survey</Button>]}> 
              <List.Item.Meta title={s.title} description={`${s.questions.length} question(s)`} />
            </List.Item>
          )}
        />
      </Card>

      <Modal title={openSurvey?.title} open={!!openSurvey} onCancel={() => setOpenSurvey(null)} onOk={submit} okText="Submit">
        <div>
          {openSurvey?.questions.map((q, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ marginBottom: 8 }}>{q}</div>
              <Radio.Group onChange={e => setAnswer(e.target.value)} value={answer}>
                <Radio value={1}>Yes</Radio>
                <Radio value={2}>No</Radio>
                <Radio value={3}>Sometimes</Radio>
              </Radio.Group>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Surveys;
