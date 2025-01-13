import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Space, Row, Col, Card, Typography } from 'antd';
import {
  LoginOutlined,
  UserAddOutlined,
} from '@ant-design/icons';

// Import the background image
import loginBackground from '../assets/loginbackground.png'; // Adjust the path if necessary

const { Title } = Typography;

const SignInSignUp = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    path === 'signin' ? navigate('/signin') : navigate('/signup');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${loginBackground})`, // Use the imported image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Row justify="center" align="middle" style={{ width: '100%' }}>
        <Col xs={24} sm={16} md={12} lg={8}>
          <Card
            bordered={false}
            style={{
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly transparent white background
              borderRadius: '10px',
              padding: '20px',
            }}
          >
            <Title level={2} style={{ marginBottom: '40px' }}>
              Welcome
            </Title>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Button
                type="primary"
                block
                icon={<LoginOutlined />}
                onClick={() => handleNavigate('signin')}
                style={{ height: '50px', fontSize: '16px' }}
              >
                Sign In
              </Button>
              <Button
                type="default"
                block
                icon={<UserAddOutlined />}
                onClick={() => handleNavigate('signup')}
                style={{ height: '50px', fontSize: '16px' }}
              >
                Sign Up
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SignInSignUp;
