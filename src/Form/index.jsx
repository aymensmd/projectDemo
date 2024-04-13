import React from 'react';
import {
  Button,
  Cascader,
  DatePicker,
  Divider,
  Form,
  Card,
  Input,
  Space,
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
      span: 10,
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

const AddUser = () => {
  
  return (
    <>
    <h3>Informations Personnelles</h3>
    <Divider />
    <Card>
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
      <Input  />
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
      <Input  />
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
      <Input type='email'   />
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
      label="Genre"
      name="Select"
      
      rules={[
        {
          required: true,
          message: 'Please input!',
        },
      ]}
    >
      
      
      <Select  >
        <Select.Option   >Homme</Select.Option>
        <Select.Option   >Femme</Select.Option>
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
      <Mentions  />
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
      <Input type='String'   />
    </Form.Item>
    

    <Form.Item
      label="numéro d'urgence "
      name="number"
      rules={[
        {
          required: true,
          message: 'Please input!',
        },
      ]}
    >
       <Space.Compact >
      <Input
        style={{
          width: '20%',
        }}
        defaultValue="0571"
      />
      <Input
        style={{
          width: '80%',
        }}
        defaultValue="21950137"
      />
    </Space.Compact>
    </Form.Item>

    

    <Form.Item
      label="Situation familiale"
      name="Situation"
      rules={[
        {
          required: true,
          message: 'Please input!',
        },
      ]}
    >
      <Select   >
        <Select.Option value="Celebataire">Celebataire</Select.Option>
        <Select.Option value="Marier">Marier</Select.Option>
        <Select.Option value="Autres">Autres</Select.Option>
      </Select>
    </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 6,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit">
        Suivant
      </Button>
    </Form.Item>
  </Form>
    </Card>
  </>
  )
}

export default AddUser