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

// Import the background image
import loginBackground from '../assets/loginbackground.png'; // Adjust the path if necessary

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

    // Additional logic for cart merging can go here...

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
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Row justify="center" align="middle" style={{ width: '100%' }}>
        <Col xs={24} sm={18} md={12} lg={8}>
          <Card
            bordered={false}
            style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              padding: '40px 30px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly transparent background
              borderRadius: '10px',
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
                  style={{ backgroundColor: '#595959', borderColor: '#595959' }}
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Button
                type="link"
                onClick={() => navigate('/signup')}
                style={{ padding: 0, color: '#595959' }}
              >
                Don't have an account? Sign Up
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SignIn;
