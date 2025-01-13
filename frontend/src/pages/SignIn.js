// src/SignIn.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Row,
  Col,
  notification,
} from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: 'topRight',
    });
  };

  const handleLogin = async (values) => {
    const { email, password } = values;
    setLoading(true);

    const userData = {
      email,
      password,
    };

    let userID = 0;
    try {
      const response = await axios.post('http://localhost:8080/login', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const { token, firstName, lastName, userId } = response.data;

        Cookies.set('authToken', token, { expires: 7 });
        Cookies.set('userName', `${firstName} ${lastName}`, { expires: 7 });
        Cookies.set('userId', userId, { expires: 7 });

        userID = userId;

        openNotificationWithIcon('success', 'Login Successful', 'You have successfully logged in!');
      } else {
        handleErrorResponse(response.status);
      }
    } catch (error) {
      if (error.response) {
        handleErrorResponse(error.response.status);
      } else {
        console.error('An error occurred during login:', error);
        openNotificationWithIcon('error', 'Error', 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }

    // Handle cart merging for non-authenticated users
    const nonUserCart = JSON.parse(localStorage.getItem('cart'));
    if (nonUserCart && nonUserCart.items.length !== 0) {
      try {
        const cartResponse = await axios.get(`/api/orders/${userID}/cart`);
        const { id: cartID } = cartResponse.data;
        localStorage.setItem('cartID', cartID);

        for (let item of nonUserCart.items) {
          for (let j = 0; j < item.quantity; j++) {
            try {
              const addItemResponse = await axios.post(
                `/api/order-items/add?orderId=${cartID}&productModelId=${item.productModel.id}`
              );
              if (addItemResponse.status !== 200) {
                throw new Error('Failed to add item to cart');
              }
            } catch (error) {
              console.error('Error adding item to cart:', error);
              // Optionally, notify the user about the failure
              break;
            }
          }
        }

        // Clean up localStorage after merging
        localStorage.removeItem('cartID');
        localStorage.removeItem('cart');
      } catch (error) {
        console.error('Error requesting cart ID:', error);
      }
    }

    navigate('/');
  };

  const handleErrorResponse = (status) => {
    switch (status) {
      case 400:
        openNotificationWithIcon('error', 'Invalid Request', 'Please check your information.');
        break;
      case 401:
        openNotificationWithIcon('error', 'Unauthorized', 'Email or password is incorrect.');
        break;
      case 404:
        openNotificationWithIcon('error', 'User Not Found', 'Please check your email.');
        break;
      case 500:
        openNotificationWithIcon('error', 'Server Error', 'Please try again later.');
        break;
      default:
        openNotificationWithIcon('error', 'Error', 'An unknown error occurred.');
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', padding: '20px' }}>
      <Col xs={24} sm={18} md={12} lg={8}>
        <Card
          bordered={false}
          style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            padding: '40px 30px',
          }}
        >
          <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
            Sign In
          </Title>
          <Form
            name="signin"
            layout="vertical"
            onFinish={handleLogin}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input your Email!' },
                { type: 'email', message: 'Please enter a valid Email!' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                size="large"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button
              type="link"
              onClick={() => navigate('/signup')}
              style={{ padding: 0 }}
            >
              Don't have an account? Sign Up
            </Button>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default SignIn;
