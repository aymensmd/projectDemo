import React, { useState } from 'react';
import { List, Button, Avatar, message } from 'antd';
import PageContainer from '../components/PageContainer';

const mock = [
  { id: 1, name: 'Sarah Williams', points: 120 },
  { id: 2, name: 'Michael Brown', points: 110 },
  { id: 3, name: 'You', points: 98 },
];

const Rewards = () => {
  const [items] = useState(mock);
  const claim = (id) => message.success('Reward claimed!');
  return (
    <PageContainer title="Rewards">
      <List
        dataSource={items}
        renderItem={i => (
          <List.Item actions={[<Button onClick={() => claim(i.id)}>Claim</Button>]}> 
            <List.Item.Meta avatar={<Avatar>{i.name.charAt(0)}</Avatar>} title={i.name} description={`${i.points} pts`} />
          </List.Item>
        )}
      />
    </PageContainer>
  );
};

export default Rewards;
