import React from 'react';
import {
  Button,
  Cascader,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Mentions,
  Select,
  TreeSelect,
} from 'antd';
const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 12,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 20,
    },
  },
};

const FormConge = () => {
  return (
    <>
    <h3>Informations Personnelles</h3>
    <Divider />
    <Form
    {...formItemLayout}
    variant="filled"
    style={{
      maxWidth: 400,
    }}
  >
    <Form.Item
      label="Nom"
      name="nom"
      rules={[
        {
          required: true,
          message: 'Please input!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Prenom"
      name="prenom"
      rules={[
        {
          required: true,
          message: 'Please input!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Date de naissance"
      name="DatePicker"
      rules={[
        {
          required: true,
          message: 'Please input!',
        },
      ]}
    >
      <DatePicker />
    </Form.Item>
    <Form.Item
      label="genre"
      name="Select"
      
      rules={[
        {
          required: true,
          message: 'Please input!',
        },
      ]}
    >
      
      
      <Select >
        <Select.Option value="homme">Homme</Select.Option>
        <Select.Option value="femme">Femme</Select.Option>
      </Select>
    </Form.Item>

    <Form.Item
      label="Adresse"
      name="Adresse"
      rules={[
        {
          required: true,
          message: 'Please input!',
        },
      ]}
    >
      <Mentions />
    </Form.Item>

    

    <Form.Item
      label="Numéro de telephone"
      name="numero"
      rules={[
        {
          required: true,
          message: 'Please input!',
        },
      ]}
    >
      <Input type='String'  />
    </Form.Item>
    <Form.Item
      label="Adresse email"
      name="email"
      rules={[
        {
          required: true,
          message: 'Please input!',
        },
      ]}
    >
      <Input type='email'  />
    </Form.Item>

    <Form.Item
      label="Departement"
      name="departement"
      rules={[
        {
          required: true,
          message: 'Please input!',
        },
      ]}
    >
      <TreeSelect >
        <Select.Option>BBS</Select.Option>
        <TreeSelect.Option>Sphere</TreeSelect.Option>

      </TreeSelect>
    </Form.Item>

    

    <Form.Item
      label="RangePicker"
      name="RangePicker"
      rules={[
        {
          required: true,
          message: 'Please input!',
        },
      ]}
    >
      <RangePicker />
    </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 6,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
  </>
  )
}

export default FormConge