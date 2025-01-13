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
  Card,
  message,
  Select,
  Spin,
  Space,
  Input,
  Descriptions,
  Divider,
  List,
} from 'antd';
import {
  LogoutOutlined,
  EditOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  SwapOutlined,
  CloseOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import newLogo from '../assets/BeyazEvim_new_logo.jpeg';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const UserPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    firstName: 'Unknown',
    lastName: 'Unknown',
    email: 'Unknown',
    address: '',
    phoneNumber: '',
  });
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filteredReturns, setFilteredReturns] = useState([]);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('ALL');
  const [selectedReturnStatus, setSelectedReturnStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState({
    address: false,
    phone: false,
  });
  const [selectedMenu, setSelectedMenu] = useState('userInfo');

  useEffect(() => {
    const token = Cookies.get('authToken');
    const userId = Cookies.get('userId');

    if (!token || !userId) {
      message.error('Authentication token or user ID is missing. Please log in again.');
      navigate('/login');
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

        const allOrders = ordersResponse.data;
        setOrders(allOrders);
        setFilteredOrders(allOrders);

        const returnsResponse = await axios.get('/api/refund-requests', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReturns(returnsResponse.data);
        setFilteredReturns(returnsResponse.data);
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

  const handleFilterOrders = (status) => {
    setSelectedOrderStatus(status);
    setFilteredOrders(
      status === 'ALL' ? orders : orders.filter((order) => order.status === status)
    );
  };

  const handleFilterReturns = (status) => {
    setSelectedReturnStatus(status);
    setFilteredReturns(
      status === 'ALL' ? returns : returns.filter((request) => request.status === status)
    );
  };

  const handleLogout = () => {
    Cookies.remove('authToken');
    Cookies.remove('userId');
    Cookies.remove('userName');
    Cookies.remove('cartId');
    navigate('/');
  };

  const handleRequestRefund = async (orderId) => {
    const token = Cookies.get('authToken');
    try {
      const response = await axios.post(
        '/api/refund-requests',
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Refund request submitted successfully.');
      // Optionally, refresh the refunds list
      setReturns([...returns, response.data]);
      setFilteredReturns(selectedReturnStatus === 'ALL' ? [...returns, response.data] : filteredReturns);
    } catch (error) {
      console.error('Refund Request Error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        message.error(`Refund Request Failed: ${error.response.data.message}`);
      } else {
        message.error('Failed to submit refund request. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
        <Content style={{ textAlign: 'center', padding: 20 }}>
          <Title level={2} style={{ color: '#ff4d4f' }}>
            Error
          </Title>
          <Text>{error}</Text>
        </Content>
      </Layout>
    );
  }

  const renderContent = () => {
    switch (selectedMenu) {
      case 'userInfo':
        return (
          <Card
            title="User Information"
            bordered={false}
            style={{
              maxWidth: 800,
              margin: '0 auto',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Descriptions column={1} bordered>
              <Descriptions.Item label="First Name">{userInfo.firstName}</Descriptions.Item>
              <Descriptions.Item label="Last Name">{userInfo.lastName}</Descriptions.Item>
              <Descriptions.Item label="Email">{userInfo.email}</Descriptions.Item>
              <Descriptions.Item label="Address">
                {isEditing.address ? (
                  <Space>
                    <Input
                      style={{ width: '300px' }}
                      defaultValue={userInfo.address}
                      onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                    />
                    <Button
                      type="primary"
                      onClick={() => {
                        setIsEditing({ ...isEditing, address: false });
                        message.success('Address updated!');
                      }}
                    >
                      Save
                    </Button>
                    <Button onClick={() => setIsEditing({ ...isEditing, address: false })}>
                      Cancel
                    </Button>
                  </Space>
                ) : (
                  <Space>
                    <Text>{userInfo.address || 'No address available'}</Text>
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => setIsEditing({ ...isEditing, address: true })}
                    >
                      Edit
                    </Button>
                  </Space>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Phone Number">
                {isEditing.phone ? (
                  <Space>
                    <Input
                      style={{ width: '300px' }}
                      defaultValue={userInfo.phoneNumber}
                      onChange={(e) => setUserInfo({ ...userInfo, phoneNumber: e.target.value })}
                    />
                    <Button
                      type="primary"
                      onClick={() => {
                        setIsEditing({ ...isEditing, phone: false });
                        message.success('Phone number updated!');
                      }}
                    >
                      Save
                    </Button>
                    <Button onClick={() => setIsEditing({ ...isEditing, phone: false })}>
                      Cancel
                    </Button>
                  </Space>
                ) : (
                  <Space>
                    <Text>{userInfo.phoneNumber || 'No phone number available'}</Text>
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => setIsEditing({ ...isEditing, phone: true })}
                    >
                      Edit
                    </Button>
                  </Space>
                )}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{
                backgroundColor: '#ff4d4f',
                borderColor: '#ff4d4f',
              }}
            >
              Logout
            </Button>
          </Card>
        );
      case 'orders':
        return (
          <Card
            title="Orders"
            bordered={false}
            style={{
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              marginBottom: 24,
            }}
          >
            <Select
              value={selectedOrderStatus}
              onChange={handleFilterOrders}
              style={{ marginBottom: 16, width: 200 }}
              placeholder="Filter Orders"
            >
              <Option value="ALL">All Orders</Option>
              <Option value="PURCHASED">Purchased</Option>
              <Option value="SHIPPED">Shipped</Option>
              <Option value="DELIVERED">Delivered</Option>
            </Select>
            <List
              grid={{ gutter: 16, column: 2 }}
              dataSource={filteredOrders.filter((order) => order.status !== 'CART')}
              renderItem={(order) => (
                <List.Item>
                  <Card
                    title={`Order ID: ${order.id}`}
                    extra={
                      order.status === 'PURCHASED' ? (
                        <Button
                          type="primary"
                          danger
                          onClick={async () => {
                            try {
                              await axios.delete(`/api/orders/${order.id}`, {
                                headers: { Authorization: `Bearer ${Cookies.get('authToken')}` },
                              });
                              message.success('Order has been cancelled and deleted. Refund will be processed.');
                              const updatedOrders = orders.filter((o) => o.id !== order.id);
                              setOrders(updatedOrders);
                              setFilteredOrders(
                                selectedOrderStatus === 'ALL'
                                  ? updatedOrders
                                  : updatedOrders.filter((o) => o.status === selectedOrderStatus)
                              );
                            } catch (error) {
                              console.error('Error deleting order:', error);
                              message.error('Failed to cancel the order. Please try again.');
                            }
                          }}
                          icon={<CloseOutlined />}
                        >
                          Cancel
                        </Button>
                      ) : order.status === 'SHIPPED' || order.status === 'DELIVERED' ? (
                        <Button
                          type="primary"
                          onClick={() => handleRequestRefund(order.id)}
                          icon={<DollarOutlined />}
                        >
                          Request Refund
                        </Button>
                      ) : null
                    }
                    style={{
                      backgroundColor: '#fafafa',
                      borderRadius: 8,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <Space direction="vertical">
                      <Text strong>Status:</Text>
                      <Text>{order.status}</Text>
                      <Text strong>Total:</Text>
                      <Text>₺{order.totalPrice}</Text>
                    </Space>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        );
      case 'returns':
        return (
          <Card
            title="Returns"
            bordered={false}
            style={{
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Select
              value={selectedReturnStatus}
              onChange={handleFilterReturns}
              style={{ marginBottom: 16, width: 200 }}
              placeholder="Filter Returns"
            >
              <Option value="ALL">All Returns</Option>
              <Option value="PENDING">Pending</Option>
              <Option value="APPROVED">Approved</Option>
              <Option value="REJECTED">Rejected</Option>
            </Select>
            <List
              grid={{ gutter: 16, column: 2 }}
              dataSource={filteredReturns}
              renderItem={(request) => (
                <List.Item>
                  <Card
                    title={`Refund ID: ${request.id}`}
                    style={{
                      backgroundColor: '#fafafa',
                      borderRadius: 8,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <Space direction="vertical">
                      <Text strong>Status:</Text>
                      <Text>{request.status}</Text>
                      <Text strong>Total:</Text>
                      <Text>₺{request.amount}</Text>
                    </Space>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Sider
        width={250}
        theme="dark"
        style={{
          backgroundColor: '#001529',
        }}
      >
        <div
          style={{
            padding: 20,
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          <Avatar src={newLogo} size={70} shape="square" />
          <Title level={4} style={{ color: '#ffffff', marginTop: 10 }}>
            {userInfo.firstName} {userInfo.lastName}
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedMenu]}
          onClick={(e) => setSelectedMenu(e.key)}
          theme="dark"
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="userInfo" icon={<UserOutlined />}>
            User Information
          </Menu.Item>
          <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
            Orders
          </Menu.Item>
          <Menu.Item key="returns" icon={<SwapOutlined />}>
            Returns
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            backgroundColor: '#001529',
            color: '#ffffff',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Title level={3} style={{ color: '#ffffff', margin: 0 }}>
            User Dashboard
          </Title>
        </Header>
        <Content style={{ padding: '24px' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserPage;
