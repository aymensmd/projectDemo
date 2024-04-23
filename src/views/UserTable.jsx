import React, { useState, useEffect } from 'react';
import { Table, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

const UsersView = () => {
  const [employees, setEmployees] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    // Fetch employees data from the API
    axios.get('http://127.0.0.1:8000/api/employees')
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
  }, []);

  const handleSearch = value => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText('');
  };

  const filteredEmployees = searchText
  ? employees.filter(employee =>
      Object.values(employee).some(value =>
        value && value.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    )
  : employees;

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'name',
      key: 'nom',
    },
   
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
 
    {
      title: 'Adresse',
      dataIndex: 'adress',
      key: 'adresse',
    },
    {
      title: 'Numéro de téléphone',
      dataIndex: 'phone_number',
      key: 'numero_telephone',
    },
    {
      title: 'Numéro d\'urgence',
      dataIndex: 'sos_number',
      key: 'numero_urgence',
    },
    {
      title: 'Situation Familiale',
      dataIndex: 'social_situation',
      key: 'situation_familiale',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text) => (
        <span>
          <a>Update </a>
          <a>Delete</a>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Input
        placeholder="Search"
        value={searchText}
        onChange={e => handleSearch(e.target.value)}
        style={{ marginBottom: 16, width: 200 }}
        prefix={<SearchOutlined />}
        allowClear
      />
      <Button onClick={handleReset}>Reset</Button>
      <Table columns={columns} dataSource={filteredEmployees} />
    </div>
  );
};

export default UsersView;
