// src/pages/SignInSignUp.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Space, Row, Col, Card, Typography } from 'antd';
import {
  LoginOutlined,
  UserAddOutlined,
  ProfileOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const SignInSignUp = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    path === 'signin' ? navigate('/signin') : navigate('/signup');
  };

  const handleProductOwnerNavigate = () => {
    navigate('/product-owner');
  };

  const handleSalesManagerNavigate = () => {
    navigate('/sales-manager'); // Navigate to Sales Manager page
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', padding: '20px' }}>
      <Col xs={24} sm={16} md={12} lg={8}>
        <Card
          bordered={false}
          style={{
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
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
            >
              Sign In
            </Button>
            <Button
              type="default"
              block
              icon={<UserAddOutlined />}
              onClick={() => handleNavigate('signup')}
            >
              Sign Up
            </Button>
            <Button
              type="dashed"
              block
              icon={<ProfileOutlined />}
              onClick={handleProductOwnerNavigate}
            >
              Go to Product Owner Page
            </Button>
            <Button
              type="dashed"
              block
              icon={<TeamOutlined />}
              onClick={handleSalesManagerNavigate}
            >
              Go to Sales Manager Page
            </Button>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default SignInSignUp;
