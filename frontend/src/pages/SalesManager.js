import React, { useState } from 'react';
import { Layout, Menu, Typography, Button, Table, Form, Input, Select } from 'antd';
import {
  PercentageOutlined,
  FileTextOutlined,
  LineChartOutlined,
  UndoOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const SalesManager = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('setDiscount'); // Default page
  const [form] = Form.useForm();

  const toggleCollapsed = () => setCollapsed(!collapsed);

  // Dynamic content rendering based on selected menu
  const renderContent = () => {
    switch (currentPage) {
      case 'setDiscount':
        return (
          <Form form={form} layout="vertical" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <Title level={3}>Set Discount</Title>
            <Form.Item
              name="product"
              label="Select Product"
              rules={[{ required: true, message: 'Please select a product!' }]}
            >
              <Select placeholder="Select a product">
                <Option value="product1">Product 1</Option>
                <Option value="product2">Product 2</Option>
                <Option value="product3">Product 3</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="discount"
              label="Discount Percentage"
              rules={[{ required: true, message: 'Please enter a discount percentage!' }]}
            >
              <Input type="number" placeholder="Enter discount percentage" />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Apply Discount
            </Button>
          </Form>
        );
      case 'viewInvoices':
        return (
          <>
            <Title level={3}>View Invoices</Title>
            <Table
              dataSource={[
                { key: 1, invoiceNumber: 'INV001', amount: '$500', status: 'Paid' },
                { key: 2, invoiceNumber: 'INV002', amount: '$300', status: 'Pending' },
              ]}
              columns={[
                { title: 'Invoice Number', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
                { title: 'Amount', dataIndex: 'amount', key: 'amount' },
                { title: 'Status', dataIndex: 'status', key: 'status' },
              ]}
            />
          </>
        );
      case 'revenueAnalysis':
        return (
          <div>
            <Title level={3}>Revenue Analysis</Title>
            <p>Graph or analysis data can be added here.</p>
          </div>
        );
      case 'refundRequest':
        return (
          <div>
            <Title level={3}>Refund Requests</Title>
            <Table
              dataSource={[
                { key: 1, orderId: 'ORD001', amount: '$100', reason: 'Defective product' },
                { key: 2, orderId: 'ORD002', amount: '$50', reason: 'Customer request' },
              ]}
              columns={[
                { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
                { title: 'Amount', dataIndex: 'amount', key: 'amount' },
                { title: 'Reason', dataIndex: 'reason', key: 'reason' },
              ]}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar Menu */}
      <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
        <div style={{ height: '32px', margin: '16px', color: 'white', textAlign: 'center' }}>
          Sales Management
        </div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={({ key }) => setCurrentPage(key)}
          selectedKeys={[currentPage]}
        >
          <Menu.Item key="setDiscount" icon={<PercentageOutlined />}>
            Set Discount
          </Menu.Item>
          <Menu.Item key="viewInvoices" icon={<FileTextOutlined />}>
            View Invoices
          </Menu.Item>
          <Menu.Item key="revenueAnalysis" icon={<LineChartOutlined />}>
            Revenue Analysis
          </Menu.Item>
          <Menu.Item key="refundRequest" icon={<UndoOutlined />}>
            Refund Requests
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Layout */}
      <Layout>
        <Header style={{ background: '#fff', padding: 0, textAlign: 'center', fontSize: 18 }}>
          Sales Manager Page
        </Header>
        <Content style={{ margin: '16px', padding: 24, background: '#fff' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SalesManager;
