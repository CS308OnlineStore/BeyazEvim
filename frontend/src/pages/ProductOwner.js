import React, { useState } from 'react';
import { Layout, Menu, Modal, Form, Input, Button, Table, Popconfirm, Select } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  AppstoreAddOutlined,
  SettingOutlined,
  InboxOutlined,
  CommentOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

const ProductOwner = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('manageProducts'); // Track current active page
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [form] = Form.useForm();

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const showAddProductModal = () => setIsModalVisible(true);

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

  const handleMenuClick = ({ key }) => {
    setCurrentPage(key);
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

  // Dynamic content 
  const renderContent = () => {
    switch (currentPage) {
      case 'manageProducts':
        return (
          <>
            <Button type="primary" icon={<PlusOutlined />} onClick={showAddProductModal}>
              Add Product
            </Button>
            <Table columns={columns} dataSource={products} style={{ marginTop: 16 }} />
          </>
        );
      case 'manageCategories':
        return <h2>Manage Categories Page: Add/Delete Categories</h2>;
      case 'updateProductStatus':
        return <h2>Update Product Status Page: Update stock statuses</h2>;
      case 'deliveryManagement':
        return <h2>Delivery Management Page: Manage and mark deliveries</h2>;
      case 'approveComments':
        return <h2>Approve Comments Page: Approve or reject user comments</h2>;
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar Menu */}
      <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
        <div style={{ height: '32px', margin: '16px', color: 'white', textAlign: 'center' }}>
          Product Management
        </div>
        <Menu theme="dark" mode="inline" onClick={handleMenuClick} selectedKeys={[currentPage]}>
          <Menu.Item key="manageProducts" icon={<AppstoreAddOutlined />}>
            Manage Products
          </Menu.Item>
          <Menu.Item key="manageCategories" icon={<DatabaseOutlined />}>
            Manage Categories
          </Menu.Item>
          <Menu.Item key="updateProductStatus" icon={<SettingOutlined />}>
            Update Product Status
          </Menu.Item>
          <Menu.Item key="deliveryManagement" icon={<InboxOutlined />}>
            Delivery Management
          </Menu.Item>
          <Menu.Item key="approveComments" icon={<CommentOutlined />}>
            Approve Comments
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Content */}
      <Layout>
        <Header style={{ background: '#fff', padding: 0, textAlign: 'center', fontSize: 18 }}>
          Product Owner Management Page
        </Header>
        <Content style={{ margin: '16px', padding: 24, background: '#fff' }}>
          {renderContent()}
        </Content>
      </Layout>

      {/* Add Product Modal */}
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

export default ProductOwner;
