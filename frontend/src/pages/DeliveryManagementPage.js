import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, message, Layout, Typography, Spin, Alert, Select } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const DeliveryManagementPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = () => {
    axios
      .get('/api/orders/all')
      .then((response) => {
        // "CART" durumundaki siparişleri filtrele
        const filteredDeliveries = response.data.filter(
          (delivery) => delivery.status !== 'CART'
        );
        setDeliveries(filteredDeliveries);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching deliveries:', error);
        setError('Failed to fetch deliveries.');
        setLoading(false);
      });
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    axios
      .put(`/api/orders/${orderId}`, { status: newStatus })
      .then(() => {
        setDeliveries((prevDeliveries) =>
          prevDeliveries.map((delivery) =>
            delivery.id === orderId ? { ...delivery, status: newStatus } : delivery
          )
        );
        message.success(`Order status updated to ${newStatus}!`);
      })
      .catch((error) => {
        console.error('Error updating delivery status:', error);
        message.error('Failed to update delivery status.');
      });
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Customer ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (text) => `₺${text.toFixed(2)}`,
    },
    {
      title: 'Delivery Address',
      dataIndex: ['orderItems', '0', 'deliveryAddress'],
      key: 'deliveryAddress',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Select
          defaultValue={record.status}
          style={{ width: 150 }}
          onChange={(value) => handleUpdateStatus(record.id, value)}
        >
          <Option value="IN_TRANSIT">In Transit</Option>
          <Option value="DELIVERED">Delivered</Option>
        </Select>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <Layout>
      <Header>
        <Title style={{ color: 'white', margin: '16px 0' }} level={2}>
          Delivery Management
        </Title>
      </Header>
      <Content style={{ padding: '20px' }}>
        <Table
          dataSource={deliveries}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Content>
    </Layout>
  );
};

export default DeliveryManagementPage;
