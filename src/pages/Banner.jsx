import { Button, Card, Drawer, Typography, Space, message } from 'antd';
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
      const userId = localStorage.getItem('USER_ID'); // Make sure to store the user ID in localStorage after login

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
<<<<<<< HEAD
      <Card style={{ padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}> {/* Removed duplicate text */}
          <div style={{ flex: '1 1 auto', minWidth: '250px', textAlign: 'left' }}> {/* Aligned text to the left */}
            <Typography.Title level={2} style={{ color: '#1890ff', fontWeight: 'bold' }}>
              Demande de congé
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: '16px' }}>
              Faire une demande de congé
=======
      <Card style={{ height: 260, padding: '20px' }}>
        <Flex vertical gap='30px'>
          <Flex vertical align="flex-start">
            <Typography.Title level={2} strong>
              something here
            </Typography.Title>
            <Typography.Text type="secondary" strong>
              some actioné
>>>>>>> 66757f1ec900002ab150887e622332506504d1ea
            </Typography.Text>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '20px' }}> {/* Adjusted button alignment */}
              <Button type="primary" size="large" style={{ borderRadius: '5px' }} onClick={showDrawer}>
                Demande
              </Button>
              <Button size="large" style={{ borderRadius: '5px', backgroundColor: '#fafafa', border: '1px solid #d9d9d9' }} onClick={showSecondDrawer}>
                Consulter votre demande
              </Button>
            </div>
          </div>
          <Space direction="horizontal" size="middle" style={{ flex: '0 1 auto', minWidth: '130px' }}> {/* Kept vacation days card */}
            <Card
              style={{
                width: '100%',
                maxWidth: '130px',
                height: '130px',
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
              <Typography.Text style={{ fontSize: '14px', color: '#595959' }}>Jours par an</Typography.Text>
            </Card>
          </Space>
        </div>
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
