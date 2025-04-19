import React from 'react';
import { Card, Spin, Alert, Empty } from 'antd';
import { useVacationPolling } from '../hooks/useVacationPolling';
import { useAuth } from '../context/AuthContext';

const Banner = () => {
  const { user } = useAuth();
  const { vacations, error, isLoading } = useVacationPolling(user?.id);

  if (isLoading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
          <p>Loading vacation requests...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
        />
      </Card>
    );
  }

  if (!vacations || vacations.length === 0) {
    return (
      <Card>
        <Empty
          description="No vacation requests found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card title="Vacation Requests">
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {vacations.map(vacation => (
          <Card.Grid
            key={vacation.id}
            style={{
              width: '100%',
              textAlign: 'left',
              marginBottom: '8px',
              background: vacation.status === 'En attente' ? '#fffbe6' : 
                         vacation.status === 'Approuvé' ? '#f6ffed' : '#fff1f0'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4>{vacation.type}</h4>
                <p>From: {new Date(vacation.start_date).toLocaleDateString()}</p>
                <p>To: {new Date(vacation.end_date).toLocaleDateString()}</p>
                <p>Status: {vacation.status}</p>
              </div>
              <div>
                <p style={{ 
                  color: vacation.status === 'En attente' ? '#faad14' : 
                         vacation.status === 'Approuvé' ? '#52c41a' : '#f5222d'
                }}>
                  {vacation.status}
                </p>
              </div>
            </div>
          </Card.Grid>
        ))}
      </div>
    </Card>
  );
};

export default Banner; 