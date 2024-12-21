import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Space } from 'antd';

const SignInSignUp = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    path === 'signin' ? navigate('/signin') : navigate('/signup');
  };

  const handleProductOwnerNavigate = () => {
    navigate('/product-owner');
  };

  const handleSalesManagerNavigate = () => {
    navigate('/sales-manager'); // salesmanager page e aktar
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', marginTop: '200px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Button type="primary" block onClick={() => handleNavigate('signin')}>
          Sign In
        </Button>
        <Button type="default" block onClick={() => handleNavigate('signup')}>
          Sign Up
        </Button>
        <Button type="link" block onClick={handleProductOwnerNavigate}>
          Go to Product Owner Page
        </Button>
        <Button type="link" block onClick={handleSalesManagerNavigate}>
          Go to Sales Manager Page
        </Button>
      </Space>
    </div>
  );
};

export default SignInSignUp;
