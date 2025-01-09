// SetRefundRequestPage.jsx

import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Button, notification, Typography } from 'antd';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const { Title } = Typography;

const SetRefundRequestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Yönlendirme state'inden orderId'yi alıyoruz
  const { orderId } = location.state || {};

  useEffect(() => {
    if (orderId) {
      form.setFieldsValue({ orderId });
    }
  }, [orderId, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { orderId, productModelId } = values;
      // API çağrısını doğru şekilde yapın
      await axios.post(
        `/api/orders/${orderId}/refund-request`,
        { productModelId },
        {
          headers: {
            // Gerekli ise yetkilendirme header'ını ekleyin
            Authorization: `Bearer ${Cookies.get('authToken')}`,
          },
        }
      );
      notification.success({
        message: 'Refund Request Created',
        description: 'The refund request has been successfully created.',
      });
      navigate('/user'); // Kullanıcı paneline yönlendir
    } catch (error) {
      console.error('Refund Request Error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        notification.error({
          message: 'Error',
          description: `Failed to create refund request: ${error.response.data.message}`,
        });
      } else {
        notification.error({
          message: 'Error',
          description: 'Failed to create refund request.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '50px auto' }}>
      <Title level={2}>Submit a Refund Request</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ orderId: orderId || undefined }}
      >
        <Form.Item
          label="Order ID"
          name="orderId"
          rules={[{ required: true, message: 'Please input the Order ID!' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Enter Order ID"
            disabled={!!orderId}
          />
        </Form.Item>
        <Form.Item
          label="Product Model ID"
          name="productModelId"
          rules={[{ required: true, message: 'Please input the Product Model ID!' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Enter Product Model ID"
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit Refund Request
        </Button>
      </Form>
    </div>
  );
};

export default SetRefundRequestPage;
