import React, { useState } from 'react';
import { Layout, Menu, Modal, Form, Input, Button, Table, Popconfirm, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, AppstoreAddOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

const ProductOwner = () => { // Component name matches file name
  const [collapsed, setCollapsed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [form] = Form.useForm();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const showAddProductModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddProduct = (values) => {
    const newProduct = {
      key: products.length + 1,
      name: values.name,
      subcategory: values.subcategory,
    };
    setProducts([...products, newProduct]);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDeleteProduct = (key) => {
    setProducts(products.filter((product) => product.key !== key));
  };

  const columns = [
    { title: 'Product Name', dataIndex: 'name', key: 'name' },
    { title: 'Subcategory', dataIndex: 'subcategory', key: 'subcategory' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this product?"
          onConfirm={() => handleDeleteProduct(record.key)}
        >
          <Button type="primary" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1" icon={<AppstoreAddOutlined />} onClick={showAddProductModal}>
            Add Product
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} />
        <Content style={{ margin: '16px', padding: 24, background: '#fff' }}>
          <Table columns={columns} dataSource={products} />
        </Content>
      </Layout>
      <Modal title="Add New Product" visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleAddProduct}>
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter the product name' }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>
          <Form.Item
            name="subcategory"
            label="Subcategory"
            rules={[{ required: true, message: 'Please select a subcategory' }]}
          >
            <Select placeholder="Select a subcategory">
              <Option value="subcategory1">Subcategory 1</Option>
              <Option value="subcategory2">Subcategory 2</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
              Add Product
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default ProductOwner; // Ensure export matches file name
