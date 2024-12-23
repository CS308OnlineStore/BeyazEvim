import React, { useState } from 'react';
import { Form, InputNumber, Button, Select, notification } from 'antd';
import axios from 'axios';

const { Option } = Select;

const SetDiscountPage = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { productId, discountRate } = values;
      const response = await axios.post(`/api/product-models/${productId}/discount/${discountRate}`);
      notification.success({
        message: 'Discount Applied',
        description: `Discount of ${discountRate}% has been applied to product ID: ${productId}.`,
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to apply discount. Please check the product ID and discount rate.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Product ID"
        name="productId"
        rules={[{ required: true, message: 'Please input the product ID!' }]}
      >
        <InputNumber style={{ width: '100%' }} placeholder="Enter Product ID" />
      </Form.Item>
      <Form.Item
        label="Discount Rate (%)"
        name="discountRate"
        rules={[{ required: true, message: 'Please input the discount rate!' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder="Enter Discount Rate"
          min={0}
          max={100}
        />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Apply Discount
      </Button>
    </Form>
  );
};

export default SetDiscountPage;
