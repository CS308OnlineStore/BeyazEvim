import React, { useState } from 'react';
import { Form, InputNumber, Button, notification } from 'antd';
import axios from 'axios';

const SetRefundRequestPage = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { orderId, productModelId } = values;
      await axios.post(`/api/orders/${orderId}/refund-request?productModelId=${productModelId}`);
      notification.success({
        message: 'Refund Request Created',
        description: 'The refund request has been successfully created.',
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to create refund request.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Order ID"
        name="orderId"
        rules={[{ required: true, message: 'Please input the Order ID!' }]}
      >
        <InputNumber style={{ width: '100%' }} placeholder="Enter Order ID" />
      </Form.Item>
      <Form.Item
        label="Product Model ID"
        name="productModelId"
        rules={[{ required: true, message: 'Please input the Product Model ID!' }]}
      >
        <InputNumber style={{ width: '100%' }} placeholder="Enter Product Model ID" />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Submit Refund Request
      </Button>
    </Form>
  );
};

export default SetRefundRequestPage;
