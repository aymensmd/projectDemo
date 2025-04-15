import React, { useState, useEffect } from 'react';
import { Button, Card, Space, Row, Col, Calendar, Modal, Form, Input, Select, DatePicker, notification, Radio, Drawer, Popconfirm, Statistic, Tooltip, Tag, Typography, Divider, Spin } from 'antd';
import { PlusOutlined, CalendarTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const responsiveCardStyle = {
  flex: 1,
  marginBottom: '16px',
  minWidth: '300px',
};

const eventTypeColor = type => (type === 'présentiel' ? 'geekblue' : 'volcano');

// Helper to get events that start on the given day only
const getEventsStartingOnDay = (events, value) => {
  return events.filter(item => moment(item.start_date).isSame(value, 'day'));
};

const EventsComponent = () => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventType, setEventType] = useState('présentiel');
  const [form] = Form.useForm();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchUsers();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/events');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/employees');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch users data!',
      });
    }
  };

  const showCreateEventModal = (date) => {
    setSelectedDate(date ? moment(date) : null);
    setModalVisible(true);
  };

  const handleCreateEvent = async () => {
    try {
      const values = await form.validateFields();
      const response = await axios.post('http://127.0.0.1:8000/api/events', {
        title: values.title,
        description: values.description,
        start_date: selectedDate ? selectedDate.format('YYYY-MM-DD HH:mm:ss') : values.dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
        end_date: values.dateRange[1] ? values.dateRange[1].format('YYYY-MM-DD HH:mm:ss') : null,
        location: eventType === 'présentiel' ? values.location : 'en ligne',
        type: eventType,
        users: selectedUsers
      });

      console.log('Event created successfully:', response.data);

      setData([...data, response.data.event]);
      form.resetFields();
      setModalVisible(false);
      notification.success({
        message: 'Success',
        description: 'Event created successfully!',
      });
    } catch (error) {
      console.error('Error creating event:', error.response ? error.response.data : error.message);
      notification.error({
        message: 'Error',
        description: 'Failed to create event!',
      });
    }
  };

  const handleUpdateEvent = async () => {
    try {
      const values = await updateForm.validateFields();
      const response = await axios.put(`http://127.0.0.1:8000/api/events/${selectedEvent.id}`, {
        title: values.title,
        description: values.description,
        start_date: values.dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
        end_date: values.dateRange[1] ? values.dateRange[1].format('YYYY-MM-DD HH:mm:ss') : null,
        location: eventType === 'présentiel' ? values.location : 'en ligne',
        type: eventType,
        users: selectedUsers
      });
  
      console.log('Event updated successfully:', response.data);
  
      // Update the state with the updated event data
      setData(data.map(event => (event.id === selectedEvent.id ? response.data.event : event)));
  
      // Reset the form and close the modal
      updateForm.resetFields();
      setUpdateModalVisible(false);
  
      // Show success notification
      notification.success({
        message: 'Success',
        description: 'Event updated successfully!',
      });
    } catch (error) {
      console.error('Error updating event:', error.response ? error.response.data : error.message);
      // Show error notification
      notification.error({
        message: 'Error',
        description: 'Failed to update event!',
      });
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/events/${selectedEvent.id}`);
      setData(data.filter(event => event.id !== selectedEvent.id));
      setDrawerVisible(false);
      notification.success({
        message: 'Success',
        description: 'Event deleted successfully!',
      });
    } catch (error) {
      console.error('Error deleting event:', error.response ? error.response.data : error.message);
      notification.error({
        message: 'Error',
        description: 'Failed to delete event!',
      });
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setModalVisible(false);
  };

  const renderEventNotifications = () => {
    return data.map((item, index) => (
      <Card 
        key={index} 
        title={item.title} 
        extra={<CalendarTwoTone />} 
        onClick={() => openDrawer(item)} 
        hoverable
        style={{ marginBottom: '16px' }}
      >
        <p>Date: {item.start_date}</p>
        <p>Users: {item.participants ? item.participants.map(user => user.name).join(', ') : 'No users assigned'}</p>
      </Card>
    ));
  };

  const openDrawer = (event) => {
    setSelectedEvent(event);
    setDrawerVisible(true);
  };

  const openUpdateModal = () => {
    if (selectedEvent) {
      setUpdateModalVisible(true);
      const { title, description, start_date, end_date, location, type, users } = selectedEvent;
      updateForm.setFieldsValue({
        title,
        description,
        dateRange: [moment(start_date), moment(end_date)],
        location,
        eventType: type,
        users: users ? users.map(user => user.id) : [],
      });
      setEventType(type);
      setSelectedUsers(users ? users.map(user => user.id) : []);
    }
  };

  const dateCellRender = (value) => {
    // Do not display anything in the calendar cell
    return null;
  };

  const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={6}>
        <Card style={{ ...responsiveCardStyle, minHeight: 180 }}>
          <Title level={4} style={{ marginBottom: 8 }}>Quick Stats</Title>
          <Divider style={{ margin: '8px 0' }} />
          <Statistic title="Total Events" value={data.length} />
          <Statistic title="Upcoming" value={data.filter(e => moment(e.start_date).isAfter(moment())).length} style={{ marginTop: 12 }} />
        </Card>
        <Card style={{ ...responsiveCardStyle, minHeight: 120, marginTop: 12, background: '#f9fbff' }}>
          <Title level={5} style={{ marginBottom: 4 }}>Tip of the Day <InfoCircleOutlined /></Title>
          <Text type="secondary">Click on a date to add an event or on an event to see details!</Text>
        </Card>
      </Col>
      <Col xs={24} md={10}>
        <Card style={responsiveCardStyle}>
          <Title level={4} style={{ marginBottom: 8 }}>Notifications</Title>
          <Divider style={{ margin: '8px 0' }} />
          <div style={{ height: '400px', overflow: 'auto' }}>
            {loading ? <Spin /> : renderEventNotifications()}
          </div>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card style={responsiveCardStyle}>
          <Space direction="vertical" style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showCreateEventModal(null)}>
              Add Event
            </Button>
          </Space>
          <div style={{ width: 300, border: '1px solid #d9d9d9', borderRadius: 8, background: '#fff', padding: 8, marginBottom: 16 }}>
            <Calendar fullscreen={false} onPanelChange={onPanelChange} />
          </div>
        </Card>
      </Col>
      <Modal
        title="Create Event"
        visible={modalVisible}
        onCancel={handleCancel}
        onOk={handleCreateEvent}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Event Title"
            rules={[{ required: true, message: 'Please input the title of the event!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Event Description"
            rules={[{ required: true, message: 'Please input the description of the event!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="dateRange"
            label="Event Dates"
            rules={[{ required: true, message: 'Please select the event dates!' }]}
          >
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={current => current && current < moment().startOf('day')}
              onChange={dates => setSelectedDate(dates[0])}
            />
          </Form.Item>
          {eventType === 'présentiel' && (
            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: 'Please input the location of the event!' }]}
            >
              <Input />
            </Form.Item>
          )}
          <Form.Item name="users" label="Select Participants">
            <Select
              mode="multiple"
              placeholder="Select users"
              onChange={setSelectedUsers}
              allowClear
            >
              {users.map(user => (
                <Option key={user.id} value={user.id}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="eventType" label="Event Type">
            <Radio.Group value={eventType} onChange={e => setEventType(e.target.value)}>
              <Radio value="présentiel">Présentiel</Radio>
              <Radio value="en ligne">En ligne</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
      <Drawer
        title="Event Details"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        width={500}
      >
        {selectedEvent && (
          <Card>
            <p><strong>Title:</strong> {selectedEvent.title}</p>
            <p><strong>Description:</strong> {selectedEvent.description}</p>
            <p><strong>Start Date:</strong> {selectedEvent.start_date}</p>
            <p><strong>End Date:</strong> {selectedEvent.end_date}</p>
            <p><strong>Location:</strong> {selectedEvent.location}</p>
            <p><strong>Type:</strong> {selectedEvent.type}</p>
            <p><strong>Participants:</strong> {selectedEvent.participants.map(user => user.name).join(', ')}</p>
            <Space>
              <Button type="primary" onClick={openUpdateModal}>Update</Button>
              <Popconfirm
                title="Are you sure to delete this event?"
                onConfirm={handleDeleteEvent}
                okText="Yes"
                cancelText="No"
              >
                <Button type="danger">Delete</Button>
              </Popconfirm>
            </Space>
          </Card>
        )}
      </Drawer>
      <Modal
        title="Update Event"
        visible={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        onOk={handleUpdateEvent}
      >
        <Form form={updateForm} layout="vertical">
          <Form.Item
            name="title"
            label="Event Title"
            rules={[{ required: true, message: 'Please input the title of the event!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Event Description"
            rules={[{ required: true, message: 'Please input the description of the event!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="dateRange"
            label="Event Dates"
            rules={[{ required: true, message: 'Please select the event dates!' }]}
          >
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={current => current && current < moment().startOf('day')}
            />
          </Form.Item>
          {eventType === 'présentiel' && (
            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: 'Please input the location of the event!' }]}
            >
              <Input />
            </Form.Item>
          )}
          <Form.Item name="users" label="Select Participants">
            <Select
              mode="multiple"
              placeholder="Select users"
              onChange={setSelectedUsers}
              allowClear
            >
              {users.map(user => (
                <Option key={user.id} value={user.id}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="eventType" label="Event Type">
            <Radio.Group value={eventType} onChange={e => setEventType(e.target.value)}>
              <Radio value="présentiel">Présentiel</Radio>
              <Radio value="en ligne">En ligne</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
};

export default EventsComponent;
