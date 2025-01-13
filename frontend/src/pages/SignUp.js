import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
import {
  UserAddOutlined,
  MailOutlined,
  LockOutlined,
} from '@ant-design/icons';

// Import the background image
import loginBackground from '../assets/loginbackground.png'; // Adjust the path if necessary

const { Title } = Typography;

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Helper function to display notifications
  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: 'topRight',
    });
  };

  // Handler for form submission
  const handleSignUp = async (values) => {
    const { firstName, lastName, email, password } = values;
    setLoading(true);

    const userData = {
      firstName,
      lastName,
      email,
      password,
    };

    try {
      const response = await axios.post('/register', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 201) {
        // Registration successful
        openNotificationWithIcon(
          'success',
          'Registration Successful',
          'You have successfully registered! Please sign in.'
        );
        navigate('/signin'); // Redirect to sign-in page after successful signup
      } else {
        handleErrorResponse(response.status);
      }
    } catch (error) {
      if (error.response) {
        handleErrorResponse(error.response.status);
      } else {
        console.error('An error occurred during registration:', error);
        openNotificationWithIcon(
          'error',
          'Error',
          'An error occurred. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to handle different error responses
  const handleErrorResponse = (status) => {
    switch (status) {
      case 400:
        openNotificationWithIcon(
          'error',
          'Invalid Request',
          'Please check your information and try again.'
        );
        break;
      case 409:
        openNotificationWithIcon(
          'error',
          'Email Already Registered',
          'This email is already registered. Please use a different email.'
        );
        break;
      case 500:
        openNotificationWithIcon(
          'error',
          'Server Error',
          'A server error occurred. Please try again later.'
        );
        break;
      default:
        openNotificationWithIcon(
          'error',
          'Error',
          'An unknown error occurred. Please try again.'
        );
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
              backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly transparent white background
              borderRadius: '10px',
            }}
          >
            <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
              Sign Up
            </Title>
            <Form
              name="signup"
              layout="vertical"
              onFinish={handleSignUp}
              autoComplete="off"
            >
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  { required: true, message: 'Please input your first name!' },
                  { min: 2, message: 'First name must be at least 2 characters.' },
                ]}
              >
                <Input
                  prefix={<UserAddOutlined />}
                  placeholder="First Name"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  { required: true, message: 'Please input your last name!' },
                  { min: 2, message: 'Last name must be at least 2 characters.' },
                ]}
              >
                <Input
                  prefix={<UserAddOutlined />}
                  placeholder="Last Name"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                  {
                    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                    message:
                      'Password must be at least 6 characters and include uppercase, lowercase letters, and a number.',
                  },
                ]}
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
                  Sign Up
                </Button>
              </Form.Item>
            </Form>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Button
                type="link"
                onClick={() => navigate('/signin')}
                style={{ padding: 0, color: '#595959' }}
              >
                Already have an account? Sign In
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SignUp;
