import React, { useState } from 'react';
import { Layout, Menu, Typography, Button, Table, Form, Input, Select } from 'antd';
import {
  PercentageOutlined,
  FileTextOutlined,
  SettingOutlined,
  LineChartOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import SetDiscountPage from './SetDiscountPage';
import SetPricePage from './SetPricePage';
import ViewInvoicesPage from './ViewInvoicesPage';
import RevenueAnalysisPage from './RevenueAnalysisPage';
import RefundRequestPage from './RefundRequestsPage';


const { Header, Sider, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const SalesManager = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('setDiscount'); // Default page
  const [form] = Form.useForm();

  const toggleCollapsed = () => setCollapsed(!collapsed);

  // Dynamic content rendering based on selected menu
  // Dynamic content rendering
  const renderContent = () => {
    switch (currentPage) {
      case 'setDiscount':
        return <SetDiscountPage />;
      case 'setPrice':
        return <SetPricePage/>;
      case 'viewInvoices':
        return <ViewInvoicesPage />; // Entegre edilen sayfa
      case 'revenueAnalysis':
        return <RevenueAnalysisPage />;
      case 'refundRequest':
        return <RefundRequestPage/>;
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
          <Menu.Item key="setPrice" icon={<SettingOutlined />}>
            Update Product Price
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
