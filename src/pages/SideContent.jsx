import React, { useState, useEffect } from 'react';
import { Card, Divider, List, Input, Avatar } from 'antd';
import { UserOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Search } = Input;

const cardStyle = {
  height: 300,
  overflow: 'auto', // Enable scroll when content exceeds the card height
};

const responsiveCardStyle = {
  ...cardStyle,
  width: '100%',
  maxWidth: 300,
  margin: '0 auto',
};

const SideContent = () => {
  // Define state to store the fetched data and search text
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API endpoint
        const response = await axios.get('http://127.0.0.1:8000/api/employees');

        // Update the state with the fetched data
        setData(response.data);
      } catch (error) {
        // Handle errors
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);

  // Filter data based on search text
  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ width: '100%', maxWidth: 300, margin: '0 auto' }}>
      {/* Search input */}
      <Search
        placeholder="Search..."
        allowClear
        onChange={e => setSearchText(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      <Card style={{ padding: '20px', background: '#f0f5ff', borderRadius: 12, boxShadow: '0 2px 8px #e6f0ff', maxHeight: 350, overflow: 'auto' }}>
        <h3 style={{ color: '#277dfe', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          Team
        </h3>
        <List
          size='small'
          itemLayout="horizontal"
          dataSource={filteredData}
          renderItem={(item, index) => (
            <List.Item key={index} style={{ background: '#f4f8ff', borderRadius: 8, marginBottom: 10, boxShadow: '0 1px 4px #e6f0f0', padding: 12, alignItems: 'flex-start' }}>
              <List.Item.Meta
                avatar={
                  <Avatar style={{ backgroundColor: '#277dfe', fontWeight: 600, fontSize: 18 }}>
                    {item.name.charAt(0).toUpperCase()}
                  </Avatar>
                }
                title={
                  <span style={{ color: '#222', fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {item.name}
                    <span style={{ color: '#277dfe', fontWeight: 500, fontSize: 11, marginLeft: 6, background: '#e6f0ff', borderRadius: 4, padding: '2px 6px' }}>
                      {item.department}
                    </span>
                  </span>
                }
                description={
                  item.email && (
                    <div style={{ color: '#888', fontSize: 12, marginTop: 2 }}>{item.email}</div>
                  )
                }
              />
            </List.Item>
          )}
        />
      </Card>
      <Card style={{ ...responsiveCardStyle, marginTop: 10 }}>
        <h3 style={{ color: '#277dfe', fontWeight: 600 }}>Performance</h3>
        <Divider />
        <div style={{ overflow: 'auto', height: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontWeight: 500, color: '#222' }}>
              Team Members: <span style={{ color: '#277dfe', fontWeight: 700 }}>{data.length}</span>
            </div>
            <div style={{ fontWeight: 500, color: '#222' }}>
              Departments: <span style={{ color: '#faad14', fontWeight: 700 }}>{[...new Set(data.map(d => d.department))].length}</span>
            </div>
            <div style={{ fontWeight: 500, color: '#222' }}>
              Avg. Performance: <span style={{ color: '#52c41a', fontWeight: 700 }}>N/A</span>
            </div>
            <div style={{ color: '#888', fontSize: 12 }}>
              * Performance metrics coming soon.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SideContent;
