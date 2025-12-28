
import React, { useEffect, useState } from 'react';
import { List, Button, Avatar, message, Spin } from 'antd';
import PageContainer from '../components/PageContainer';
import axios from '../axios';

const Rewards = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await axios.get('/rewards');
        setItems(response.data);
      } catch (error) {
        message.error('Failed to load rewards');
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
  }, []);

  const claim = (id) => message.success('Reward claimed!');

  return (
    <PageContainer title="Rewards">
      {loading ? <Spin /> : (
        <List
          dataSource={items}
          renderItem={i => (
            <List.Item actions={[<Button onClick={() => claim(i.id)}>Claim</Button>]}> 
              <List.Item.Meta avatar={<Avatar>{i.name?.charAt(0)}</Avatar>} title={i.name} description={`${i.points} pts`} />
            </List.Item>
          )}
        />
      )}
    </PageContainer>
  );
};

export default Rewards;
