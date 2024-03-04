import { Avatar, Card, Divider, List } from 'antd';
import React from 'react';

const data = [
  {
    title: 'dev 1',
  },
  {
    title: 'Aymen Sammoud',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];

const cardStyle = {
  height: 300,
  overflow: 'auto', // Enable scroll when content exceeds the card height
  
};

const SideContent = () => {
  return (
    <div style={{ width: 300 }}>
      <Card style={cardStyle}>
        <h3>Team</h3>
        
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                title={<a href="https://ant.design">{item.title}</a>}
                description="Dev "
              />
            </List.Item>
          )}
        />
      </Card>
      <Card style={{ ...cardStyle, top: 10 }}>
        <h3>Performance</h3>
        <Divider />
        <div style={{ overflow: 'auto', height: '100%' }}>
          {/* Add your content inside the div */}
        </div>
      </Card>
    </div>
  );
};

export default SideContent;
