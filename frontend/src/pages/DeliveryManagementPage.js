import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, message, Layout, Typography, Spin, Alert, Select } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const DeliveryManagementPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const addressCache = {};
  
  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get('/api/orders/all');
      const filteredDeliveries = response.data.filter(
        (delivery) => ['PURCHASED', 'SHIPPED', 'DELIVERED'].includes(delivery.status) 
      );
      const deliveriesWithAddresses = await Promise.all(
        filteredDeliveries.map(async (delivery) => {
          if (addressCache[delivery.userId]) {
            // Use cached address if available
            return { ...delivery, deliveryAddress: addressCache[delivery.userId] };
          }
          try {
            const addressResponse = await axios.get(`/api/users/${delivery.userId}/address`);
            const address = addressResponse.data.newAddress;
            addressCache[delivery.userId] = address;
            return { ...delivery, deliveryAddress: address };
          } catch (err) {
            console.error(`Failed to fetch address for user ${delivery.userId}:`, err);
            return { ...delivery, deliveryAddress: 'N/A' };
          }
        })
      );

      setDeliveries(deliveriesWithAddresses);
      setLoading(false);
    }
    catch(error) {
      console.error('Error fetching deliveries:', error);
      setError('Failed to fetch deliveries.');
      setLoading(false);
    };
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    axios
      .put(`/api/orders/${orderId}/status`, { status: newStatus })
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

  const handleGetInvoice = (orderId) => {
    axios.get(`/api/invoices/order/${orderId}/pdf`, {
      responseType: 'blob',
    })
         .then((response)=>{
          message.success('Your invoice is ready!');
          const fileURL = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
          window.open(fileURL, '_blank');

         })
         .catch((error) => {
          console.error('Error getting invoice pdf:', error);
          message.error('Error getting invoice.');
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
      dataIndex: 'deliveryAddress',
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
      render: (_, record) => {
        let availableStatuses = [];

        // Determine available statuses based on the current status
        switch (record.status) {
          case 'PURCHASED':
            availableStatuses = ['SHIPPED', 'DELIVERED'];
            break;
          case 'SHIPPED':
            availableStatuses = ['DELIVERED'];
            break;
          case 'DELIVERED':
            availableStatuses = ['DELIVERED'];
            break;
          default:
            return null;
        }

        return (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Select
              defaultValue={record.status}
              style={{ width: 150 }}
              onChange={(value) => handleUpdateStatus(record.id, value)}
            >
              {availableStatuses.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              icon={<FileTextOutlined />}
              onClick={() => handleGetInvoice(record.id)}
            >
            </Button>
          </div>
        );
      },
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
          dataSource={Array.isArray(deliveries) ? deliveries : []}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Content>
    </Layout>
  );
};

export default DeliveryManagementPage;
