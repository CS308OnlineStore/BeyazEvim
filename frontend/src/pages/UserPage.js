// UserPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  Layout,
  Menu,
  Avatar,
  Typography,
  Button,
  Form,
  Input,
  List,
  Card,
  Modal,
  message,
  Tabs,
  Space,
  Spin,
} from 'antd';
import {
  EditOutlined,
  LogoutOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import newLogo from '../assets/BeyazEvim_new_logo.jpeg';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { confirm } = Modal;
const { TabPane } = Tabs;

const UserPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    firstName: 'Unknown',
    lastName: 'Unknown',
    email: 'Unknown',
    address: '',
    phoneNumber: '',
  });
  const [orders, setOrders] = useState({
    delivered: [],
    current: [],
    inTransit: [],
    returned: [],
  });
  const [isEditing, setIsEditing] = useState({
    address: false,
    phone: false,
  });
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get('authToken');
    const userId = Cookies.get('userId');

    if (!token || !userId) {
      message.error('Authentication token or user ID is missing. Please log in again.');
      navigate('/login'); // Giriş sayfasına yönlendirme
      return;
    }

    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(userResponse.data);

        const ordersResponse = await axios.get(`/api/orders/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const delivered = ordersResponse.data.filter((order) => order.status === 'DELIVERED');
        const current = ordersResponse.data.filter((order) => order.status === 'PURCHASED');
        const inTransit = ordersResponse.data.filter((order) => order.status === 'SHIPPED');
        const returned = ordersResponse.data.filter(
          (order) => order.status === 'RETURNED' || order.status === 'CANCELLED'
        );

        setOrders({
          delivered,
          current,
          inTransit,
          returned,
        });
      } catch (err) {
        console.error('API Error:', err);
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Failed to load user information.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEdit = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
    form.setFieldsValue({ [field]: userInfo[field] });
  };

  const handleCancelOrder = (orderId) => {
    confirm({
      title: 'Are you sure you want to cancel this order?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          const token = Cookies.get('authToken');
          if (!token) {
            message.error('Authentication token is missing. Please log in again.');
            navigate('/login');
            return;
          }

          const response = await axios.put(`/api/orders/${orderId}/cancel`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.status === 200) {
            message.success('Order cancelled successfully.');
            setOrders((prevOrders) => ({
              ...prevOrders,
              current: prevOrders.current.filter((order) => order.id !== orderId),
            }));

            // Redirect to Set Refund Request Page after successful cancellation
            navigate('/setrefundrequest', { state: { orderId } });
          } else {
            // Display message for unsuccessful status codes
            message.error(`Order could not be cancelled. Status Code: ${response.status}`);
          }
        } catch (err) {
          console.error('Error cancelling order:', err);
          if (err.response && err.response.data && err.response.data.message) {
            message.error(`Failed to cancel the order: ${err.response.data.message}`);
          } else {
            message.error('Failed to cancel the order.');
          }
        }
      },
    });
  };

  const handleGetInvoice = (orderId) => {
    axios
      .get(`/api/invoices/order/${orderId}/pdf`, { responseType: 'blob' })
      .then((response) => {
        const fileURL = URL.createObjectURL(
          new Blob([response.data], { type: 'application/pdf' })
        );
        window.open(fileURL, '_blank');
      })
      .catch((error) => {
        console.error('Error getting invoice PDF:', error);
        message.error('Error getting invoice.');
      });
  };

  const handleSave = async (field) => {
    try {
      const token = Cookies.get('authToken');
      const userId = Cookies.get('userId');
      const value = form.getFieldValue(field);

      if (!token || !userId) {
        message.error('Authentication token or user ID is missing. Please log in again.');
        navigate('/login');
        return;
      }

      const endpoint = field === 'address'
        ? `/api/users/${userId}/address`
        : `/api/users/${userId}/phone`;

      const response = await axios.put(endpoint, { value }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserInfo((prev) => ({
        ...prev,
        [field]: response.data[field],
      }));
      setIsEditing((prev) => ({ ...prev, [field]: false }));
      message.success(`${field === 'address' ? 'Address' : 'Phone number'} updated successfully.`);
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      if (err.response && err.response.data && err.response.data.message) {
        message.error(`Failed to update ${field}: ${err.response.data.message}`);
      } else {
        message.error(`Failed to update ${field}.`);
      }
    }
  };

  const handleLogout = () => {
    Cookies.remove('authToken');
    Cookies.remove('userId');
    navigate('/');
    window.location.reload();
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Content style={{ textAlign: 'center', padding: 20 }}>
          <Title level={2} style={{ color: 'red' }}>
            Error
          </Title>
          <Text>{error}</Text>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Sider width={250} theme="light">
        <div style={{ padding: 20, textAlign: 'center' }}>
          <Avatar src={newLogo} size={70} />
          <Title level={4}>
            {userInfo.firstName} {userInfo.lastName}
          </Title>
          <Text type="secondary">{userInfo.email}</Text>
        </div>
        <Menu>
          <Menu.Item icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#001529', color: 'white', padding: '0 20px' }}>
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            User Dashboard
          </Title>
        </Header>
        <Content style={{ padding: 20 }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="User Information" key="1">
              <Card title="User Information" bordered={false}>
                <List>
                  <List.Item>
                    <Text strong>First Name:</Text> <Text>{userInfo.firstName}</Text>
                  </List.Item>
                  <List.Item>
                    <Text strong>Last Name:</Text> <Text>{userInfo.lastName}</Text>
                  </List.Item>
                  <List.Item>
                    <Text strong>Email:</Text> <Text>{userInfo.email}</Text>
                  </List.Item>
                  <List.Item>
                    <Text strong>Address:</Text>
                    {isEditing.address ? (
                      <Space>
                        <Form form={form} onFinish={() => handleSave('address')}>
                          <Form.Item name="address" style={{ margin: 0 }}>
                            <Input style={{ width: '300px' }} />
                          </Form.Item>
                          <Button type="primary" htmlType="submit">
                            Save
                          </Button>
                        </Form>
                      </Space>
                    ) : (
                      <Space>
                        <Text>{userInfo.address || 'No address available'}</Text>
                        <Button
                          type="link"
                          icon={<EditOutlined />}
                          onClick={() => handleEdit('address')}
                        >
                          Edit
                        </Button>
                      </Space>
                    )}
                  </List.Item>
                  <List.Item>
                    <Text strong>Phone Number:</Text>
                    {isEditing.phone ? (
                      <Space>
                        <Form form={form} onFinish={() => handleSave('phoneNumber')}>
                          <Form.Item name="phoneNumber" style={{ margin: 0 }}>
                            <Input style={{ width: '300px' }} />
                          </Form.Item>
                          <Button type="primary" htmlType="submit">
                            Save
                          </Button>
                        </Form>
                      </Space>
                    ) : (
                      <Space>
                        <Text>{userInfo.phoneNumber || 'No phone number available'}</Text>
                        <Button
                          type="link"
                          icon={<EditOutlined />}
                          onClick={() => handleEdit('phoneNumber')}
                        >
                          Edit
                        </Button>
                      </Space>
                    )}
                  </List.Item>
                </List>
              </Card>
            </TabPane>

            <TabPane tab="Active Orders" key="2">
              <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={orders.current}
                renderItem={(order) => (
                  <List.Item>
                    <Card
                      title={`Order ID: ${order.id}`}
                      extra={
                        <Button
                          type="primary"
                          danger
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          Cancel
                        </Button>
                      }
                    >
                      <p>Status: {order.status}</p>
                      <List
                        dataSource={order.orderItems}
                        renderItem={(item) => (
                          <List.Item>
                            {item.productModel.name} - {item.quantity} x ₺{item.unitPrice}
                          </List.Item>
                        )}
                      />
                      <p>Total: ₺{order.totalPrice}</p>
                      <Button
                        type="default"
                        icon={<FileTextOutlined />}
                        onClick={() => handleGetInvoice(order.id)}
                      >
                        Get Invoice
                      </Button>
                    </Card>
                  </List.Item>
                )}
              />
            </TabPane>

            <TabPane tab="In-Transit Orders" key="3">
              <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={orders.inTransit}
                renderItem={(order) => (
                  <List.Item>
                    <Card title={`Order ID: ${order.id}`}>
                      <p>Status: {order.status}</p>
                      <List
                        dataSource={order.orderItems}
                        renderItem={(item) => (
                          <List.Item>
                            {item.productModel.name} - {item.quantity} x ₺{item.unitPrice}
                          </List.Item>
                        )}
                      />
                      <p>Total: ₺{order.totalPrice}</p>
                      <Button
                        type="default"
                        icon={<FileTextOutlined />}
                        onClick={() => handleGetInvoice(order.id)}
                      >
                        Get Invoice
                      </Button>
                    </Card>
                  </List.Item>
                )}
              />
            </TabPane>

            <TabPane tab="Delivered Orders" key="4">
              <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={orders.delivered}
                renderItem={(order) => (
                  <List.Item>
                    <Card
                      title={`Order ID: ${order.id}`}
                      extra={
                        <Button
                          type="primary"
                          danger
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          Cancel
                        </Button>
                      }
                    >
                      <p>Status: {order.status}</p>
                      <List
                        dataSource={order.orderItems}
                        renderItem={(item) => (
                          <List.Item>
                            {item.productModel.name} - {item.quantity} x ₺{item.unitPrice}
                          </List.Item>
                        )}
                      />
                      <p>Total: ₺{order.totalPrice}</p>
                      <Button
                        type="default"
                        icon={<FileTextOutlined />}
                        onClick={() => handleGetInvoice(order.id)}
                      >
                        Get Invoice
                      </Button>
                    </Card>
                  </List.Item>
                )}
              />
            </TabPane>

            <TabPane tab="Returned Orders" key="5">
              <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={orders.returned}
                renderItem={(order) => (
                  <List.Item>
                    <Card title={`Order ID: ${order.id}`}>
                      <p>Status: {order.status}</p>
                      <List
                        dataSource={order.orderItems}
                        renderItem={(item) => (
                          <List.Item>
                            {item.productModel.name} - {item.quantity} x ₺{item.unitPrice}
                          </List.Item>
                        )}
                      />
                      <p>Total: ₺{order.totalPrice}</p>
                      <Button
                        type="default"
                        icon={<FileTextOutlined />}
                        onClick={() => handleGetInvoice(order.id)}
                      >
                        Get Invoice
                      </Button>
                    </Card>
                  </List.Item>
                )}
              />
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    </Layout>
  );

  // No longer needed: Refund request function has been removed
};

export default UserPage;
