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
  List,
  Card,
  message,
  Tabs,
  Select,
  Spin,
  Space,
  Input,
} from 'antd';
import { LogoutOutlined, EditOutlined } from '@ant-design/icons';
import newLogo from '../assets/BeyazEvim_new_logo.jpeg';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
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
        <div
          style={{
            padding: 20,
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          <Avatar src={newLogo} size={70} />
          <Title level={4}>
            {userInfo.firstName} {userInfo.lastName}
          </Title>
          <Text type="secondary">{userInfo.email}</Text>
        </div>
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
                    <Text strong>Address:</Text>{' '}
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
                  </List.Item>
                  <List.Item>
                    <Text strong>Phone Number:</Text>{' '}
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
                  </List.Item>
                </List>
                <Button
                  type="primary"
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  style={{
                    marginTop: 20,
                    background: '#ff4d4f',
                    borderColor: '#ff4d4f',
                  }}
                >
                  Logout
                </Button>
              </Card>
            </TabPane>
            <TabPane tab="Orders" key="2">
              <Select
                value={selectedOrderStatus}
                onChange={handleFilterOrders}
                style={{ marginBottom: 16 }}
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
                        <Button
                          type="primary"
                          danger
                          onClick={() => message.info('Cancel feature not yet implemented.')}
                        >
                          Cancel
                        </Button>
                      }
                    >
                      <p>Status: {order.status}</p>
                      <p>Total: ₺{order.totalPrice}</p>
                    </Card>
                  </List.Item>
                )}
              />
            </TabPane>
            <TabPane tab="Returns" key="3">
              <Select
                value={selectedReturnStatus}
                onChange={handleFilterReturns}
                style={{ marginBottom: 16 }}
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
                    <Card title={`Refund ID: ${request.id}`}>
                      <p>Status: {request.status}</p>
                      <p>Total: ₺{request.amount}</p>
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
};

export default UserPage;
