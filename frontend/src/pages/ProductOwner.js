import React, { useState } from 'react';
import { Layout, Menu, Modal, Form, Input, Button, Table, Popconfirm, Select } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  AppstoreAddOutlined,
  SettingOutlined,
  InboxOutlined,
  CommentOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import ManageProductsPage from './ManageProductsPage';
import ManageCategoriesPage from './ManageCategoriesPage';
import UpdateProductStatusPage from './UpdateProductStatusPage';
import DeliveryManagementPage from './DeliveryManagementPage';
import ApproveCommentsPage from './ApproveCommentsPage';

const { Header, Sider, Content } = Layout;

const ProductOwner = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('manageProducts'); // Track current active page

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleMenuClick = ({ key }) => {
    setCurrentPage(key);
  };


  // Dynamic content rendering
  const renderContent = () => {
    switch (currentPage) {
      case 'manageProducts':
        return <ManageProductsPage />;
      case 'manageCategories':
        return <ManageCategoriesPage />; // Entegre edilen sayfa
      case 'updateProductStatus':
        return <UpdateProductStatusPage />;
      case 'deliveryManagement':
        return <DeliveryManagementPage/>;
      case 'approveComments':
        return <ApproveCommentsPage/>;
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

      {/* Main Layout */}
      <Layout>
        <Header style={{ background: '#fff', padding: 0, textAlign: 'center', fontSize: 18 }}>
          Product Owner Management Page
        </Header>
        <Content style={{ margin: '16px', padding: 24, background: '#fff' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProductOwner;
