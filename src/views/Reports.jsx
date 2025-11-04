import React, { useState } from 'react';
import { Typography, Card, Select, Button, Space, DatePicker, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const Reports = () => {
  const [type, setType] = useState('attendance');
  const [range, setRange] = useState(null);

  const generate = () => {
    message.success(`Generating ${type} report...`);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Reports</Title>
      <Card style={{ marginTop: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select value={type} onChange={setType} style={{ width: 260 }}>
            <Select.Option value="attendance">Attendance Report</Select.Option>
            <Select.Option value="payroll">Payroll Report</Select.Option>
            <Select.Option value="performance">Performance Report</Select.Option>
          </Select>
          <RangePicker onChange={(dates) => setRange(dates)} />
          <div>
            <Button type="primary" icon={<DownloadOutlined />} onClick={generate}>Generate</Button>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Reports;
