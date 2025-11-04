import React, { useState } from 'react';
import { Typography, Card, Calendar as AntCalendar, Badge } from 'antd';

const { Title, Paragraph } = Typography;

const getListData = (value) => {
  const listData = [];
  if (value.date() === 8) {
    listData.push({ type: 'warning', content: 'Team sync meeting 10:00' });
  }
  if (value.date() === 10) {
    listData.push({ type: 'success', content: 'Project deadline' });
  }
  if (value.date() === 15) {
    listData.push({ type: 'error', content: 'Office closed (Holiday)' });
  }
  return listData;
}

const dateCellRender = (value) => {
  const listData = getListData(value);
  return (
    <ul className="events" style={{ paddingLeft: 8 }}>
      {listData.map((item, idx) => (
        <li key={idx} style={{ listStyle: 'none', marginBottom: 4 }}>
          <Badge status={item.type} text={item.content} />
        </li>
      ))}
    </ul>
  );
}

const Calendar = () => {
  const [value, setValue] = useState(null);
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Calendar</Title>
      <Paragraph>View and manage your events, meetings, and deadlines.</Paragraph>
      <Card style={{ marginTop: 16 }}>
        <AntCalendar
          fullscreen={false}
          onSelect={(v) => setValue(v)}
          dateCellRender={dateCellRender}
        />
      </Card>
    </div>
  );
};

export default Calendar;
