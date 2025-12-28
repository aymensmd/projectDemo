
import React, { useEffect, useState } from 'react';
import { Typography, Card, List, Button, Modal, Radio, message, Spin } from 'antd';
import axios from '../axios';

const { Title } = Typography;

const Surveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [openSurvey, setOpenSurvey] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get('/surveys');
        setSurveys(response.data);
      } catch (error) {
        message.error('Failed to load surveys');
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

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
        {loading ? <Spin /> : (
          <List
            dataSource={surveys}
            renderItem={s => (
              <List.Item actions={[<Button onClick={() => take(s)}>Take Survey</Button>]}> 
                <List.Item.Meta title={s.title} description={`${s.questions.length} question(s)`} />
              </List.Item>
            )}
          />
        )}
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
