import React, { useState, useRef } from 'react';
import { Typography, Card, Button, List, Tag } from 'antd';

const { Title } = Typography;

const TimeTracking = () => {
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [logs, setLogs] = useState([]);
  const timerRef = useRef(null);

  const start = () => {
    setRunning(true);
    const now = new Date();
    setStartTime(now);
    timerRef.current = setInterval(() => {}, 1000);
  };
  const stop = () => {
    setRunning(false);
    const end = new Date();
    clearInterval(timerRef.current);
    if (startTime) {
      setLogs([{ start: startTime, end }, ...logs]);
      setStartTime(null);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Time Tracking</Title>
      <Card style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <Button type={running ? 'default' : 'primary'} onClick={running ? stop : start} style={{ marginRight: 12 }}>
            {running ? 'Stop' : 'Start'}
          </Button>
          {running && <Tag color="processing">Tracking since: {startTime?.toLocaleTimeString()}</Tag>}
        </div>
        <List
          header={<div>Recent Logs</div>}
          dataSource={logs}
          renderItem={item => (
            <List.Item>
              <div>{new Date(item.start).toLocaleString()} — {new Date(item.end).toLocaleString()}</div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default TimeTracking;
