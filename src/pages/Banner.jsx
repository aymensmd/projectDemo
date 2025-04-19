import { Button, Card, Drawer, Typography, Space, message, Flex } from 'antd';
import React, { useState, useEffect } from 'react';
import CongeForm from '../Form/CongeForm';
import VacData from '../data/VacData';
import axios from 'axios';

const Banner = ({ userId }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [secondDrawerVisible, setSecondDrawerVisible] = useState(false);
  const [vacationDays, setVacationDays] = useState(0);

  useEffect(() => {
    fetchVacations();
    const interval = setInterval(fetchVacations, 5000); // Fetch data every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const fetchVacations = async () => {
    try {
      const token = localStorage.getItem('ACCESS_TOKEN');
      const userId = localStorage.getItem('USER_ID');

      if (!token) {
        message.error('User is not authenticated');
        return;
      }

      const response = await axios.get(`http://127.0.0.1:8000/api/vacations/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      calculateTotalVacationDays(response.data);
    } catch (error) {
      console.error('Failed to fetch vacations', error);
      message.error('Failed to fetch vacations');
    }
  };

  const calculateTotalVacationDays = (vacations) => {
    let totalDays = 0;
    vacations
      .filter(vacation => vacation.status === 'Approuvé')
      .forEach(vacation => {
        const startDate = new Date(vacation.start_date);
        const endDate = new Date(vacation.end_date);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        totalDays += days;
      });
    setVacationDays(totalDays);
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const showSecondDrawer = () => {
    setSecondDrawerVisible(true);
  };

  const closeSecondDrawer = () => {
    setSecondDrawerVisible(false);
  };

  return (
    <>
      <Card style={{ 
        padding: '20px', 
        borderRadius: '10px', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px'
      }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Flex vertical align="flex-start" style={{ flex: 1, minWidth: 250 }}>
            <Typography.Title level={2} style={{ color: '#1890ff', fontWeight: 'bold' }}>
              Demande de congé
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: '16px' }}>
              Faire une demande de congé
            </Typography.Text>
            <Flex gap={16} style={{ marginTop: '20px' }}>
              <Button type="primary" size="large" style={{ borderRadius: '5px' }} onClick={showDrawer}>
                Demande
              </Button>
              <Button size="large" style={{ 
                borderRadius: '5px', 
                backgroundColor: '#fafafa', 
                border: '1px solid #d9d9d9' 
              }} onClick={showSecondDrawer}>
                Consulter votre demande
              </Button>
            </Flex>
          </Flex>
          
          <Card
            style={{
              width: 130,
              height: 130,
              textAlign: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRadius: '10px',
              backgroundColor: '#f0f5ff',
            }}
            bordered
          >
            <Typography.Title level={4} style={{ color: '#1890ff' }}>
              {vacationDays} / 25
            </Typography.Title>
            <Typography.Text style={{ fontSize: '14px', color: '#595959' }}>
              Jours par an
            </Typography.Text>
          </Card>
        </Flex>
      </Card>

      <Drawer
        title="Faire une demande de congé"
        placement="right"
        onClose={closeDrawer}
        open={drawerVisible}
        width={700}
      >
        <CongeForm />
      </Drawer>

      <Drawer
        title="Consulter ou modifier votre demande"
        placement="right"
        onClose={closeSecondDrawer}
        open={secondDrawerVisible}
        width={900}
      >
        <VacData setTotalVacationDays={setVacationDays} />
      </Drawer>
    </>
  );
};

export default Banner;