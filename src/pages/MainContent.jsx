import React, { useState, useEffect } from 'react';
import { Card, notification, Space, Modal, Avatar, Divider, Spin } from 'antd';
import Banner from './Banner';
import axios from 'axios';

const eventCardStyle = {
  background: 'rgb(0 0 176 249)', // Light blue background color
  marginBottom: '16px', // Spacing between cards
  width: '200px', // Reduced width for smaller cards
  height: '200px', // Reduced height for smaller cards
  overflow: 'hidden', // Prevent scrollbar from appearing
};

const responsiveEventCardStyle = {
  ...eventCardStyle,
  width: '100%',
  maxWidth: '200px', // Adjust max width for smaller cards
  margin: '0 auto',
};

const EVENTS_PER_PAGE = 4;

const MainContent = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [endedEventIds, setEndedEventIds] = useState([]); // Track ended events
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);
  const paginatedEvents = events.slice((currentPage - 1) * EVENTS_PER_PAGE, currentPage * EVENTS_PER_PAGE);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Check for newly ended events and notify
  useEffect(() => {
    if (!loading && events.length > 0) {
      const now = new Date();
      const newlyEnded = events.filter(event => {
        return (
          event.end_date &&
          new Date(event.end_date) < now &&
          !endedEventIds.includes(event.id)
        );
      });
      if (newlyEnded.length > 0) {
        newlyEnded.forEach(event => {
          notification.info({
            message: `Event Ended`,
            description: `The event "${event.title}" has ended.`,
            duration: 5,
          });
        });
        setEndedEventIds(prev => [
          ...prev,
          ...newlyEnded.map(e => e.id)
        ]);
      }
    }
  }, [events, loading, endedEventIds]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/events');
      setEvents(response.data);
      setLoading(false); // Set loading to false when data is fetched successfully
    } catch (error) {
      console.error('Error fetching events:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch events!',
      });
      setLoading(false); // Set loading to false in case of error
    }
  };

  const openModal = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setModalVisible(false);
  };

  return (
    <div style={{ flex: 1 }}>
      <Banner />
      <br />
      <Card style={{ padding: '12px 8px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', background: '#f9fbff', marginBottom: 16, Height: 600}}>
        <h3 style={{ margin: '0 0 12px 4px', color: '#277dfe', fontWeight: 700, fontSize: 16 }}>Notifications</h3>
        <Space wrap style={{ justifyContent: 'center' }}>
          {loading ? (
            <Spin size="large" />
          ) : (
            paginatedEvents.map(event => (
              <Card
                size="small"
                key={event.id}
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#222' }}>{event.title}</span>
                    <span style={{
                      fontSize: 9,
                      color: event.end_date && new Date(event.end_date) < new Date() ? '#cf1322' : '#389e0d',
                      fontWeight: 500,
                      marginLeft: 8,
                      background: event.end_date && new Date(event.end_date) < new Date() ? '#fff1f0' : '#f6ffed',
                      border: `1px solid ${event.end_date && new Date(event.end_date) < new Date() ? '#ffa39e' : '#b7eb8f'}`,
                      borderRadius: 5,
                      padding: '0px 5px',
                      minWidth: 32,
                      textAlign: 'center',
                      display: 'inline-block',
                      height: 15,
                      lineHeight: '13px',
                    }}>
                      {event.end_date && new Date(event.end_date) < new Date() ? 'Ended' : 'Ongoing'}
                    </span>
                  </div>
                }
                style={{ width: 220, height: 210, minHeight: 210, maxHeight: 210, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 7, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', background: '#fff', margin: 4, cursor: 'pointer', padding: 0 }}
                headStyle={{ background: '#e6f0ff', borderRadius: '7px 7px 0 0', padding: '6px 12px' }}
                bodyStyle={{ padding: '8px 12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 0 }}
                hoverable
                onClick={() => openModal(event)}
              >
                <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>Date: {event.start_date}</div>
                <div style={{ fontSize: 13, color: '#555', marginBottom: 4, flex: 1 }}>
                  Description: {event.description && event.description.length > 60
                    ? event.description.slice(0, 60) + '...'
                    : event.description}
                </div>
                <div style={{ fontSize: 12, color: '#555', marginBottom: 2, fontWeight: 500 }}>Users Assigned:</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 2 }}>
                  {(event.users && event.users.length > 0 ? event.users : event.participants && event.participants.length > 0 ? event.participants : []).length > 0 ? (
                    (event.users && event.users.length > 0 ? event.users : event.participants).map(user => (
                      <span key={user.id} style={{ display: 'flex', alignItems: 'center', marginRight: 6 }}>
                        <Avatar size={18} src={user.avatar} style={{ marginRight: 2, background: '#e6f0ff', color: '#277dfe', fontSize: 11 }}>
                          {user.name ? user.name.charAt(0) : '?'}
                        </Avatar>
                        <span style={{ fontSize: 11, color: '#555' }}>{user.name}</span>
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: 11, color: '#aaa' }}>No users assigned</span>
                  )}
                </div>
              </Card>
            ))
          )}
        </Space>
        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ marginRight: 8 }}>
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  margin: '0 2px',
                  fontWeight: currentPage === i + 1 ? 'bold' : 'normal',
                  background: currentPage === i + 1 ? '#277dfe' : '#fff',
                  color: currentPage === i + 1 ? '#fff' : '#277dfe',
                  border: '1px solid #277dfe',
                  borderRadius: 4,
                  padding: '2px 8px',
                  cursor: 'pointer',
                }}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ marginLeft: 8 }}>
              Next
            </button>
          </div>
        )}
      </Card>
      <Modal
        title={selectedEvent ? selectedEvent.title : ''}
        visible={modalVisible}
        onCancel={closeModal}
        footer={null}
        bodyStyle={{ borderRadius: 10, background: '#f9fbff', padding: 24 }}
        style={{ top: 60 }}
      >
        {selectedEvent && (
          <div style={{ minWidth: 320 }}>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontWeight: 600, color: '#277dfe', fontSize: 15 }}>Date:</span>
              <span style={{ marginLeft: 8, color: '#333', fontSize: 14 }}>{selectedEvent.start_date}</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontWeight: 600, color: '#277dfe', fontSize: 15 }}>Description:</span>
              <span style={{ marginLeft: 8, color: '#333', fontSize: 14 }}>{selectedEvent.description}</span>
            </div>
            <Divider style={{ margin: '16px 0' }} />
            <div style={{ marginBottom: 8, fontWeight: 600, color: '#277dfe', fontSize: 15 }}>Users Assigned:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {(selectedEvent.users && selectedEvent.users.length > 0 ? selectedEvent.users : selectedEvent.participants && selectedEvent.participants.length > 0 ? selectedEvent.participants : []).length > 0 ? (
                (selectedEvent.users && selectedEvent.users.length > 0 ? selectedEvent.users : selectedEvent.participants).map(user => (
                  <div key={user.id} style={{ display: 'flex', alignItems: 'center', background: '#e6f0ff', borderRadius: 6, padding: '4px 10px', marginBottom: 4 }}>
                    <Avatar size={28} src={user.avatar} style={{ marginRight: 8, background: '#fff', color: '#277dfe', fontWeight: 600 }}>
                      {user.name ? user.name.charAt(0) : '?'}
                    </Avatar>
                    <span style={{ fontSize: 13, color: '#222', fontWeight: 500 }}>{user.name}</span>
                  </div>
                ))
              ) : (
                <span style={{ fontSize: 13, color: '#aaa' }}>No users assigned</span>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MainContent;
