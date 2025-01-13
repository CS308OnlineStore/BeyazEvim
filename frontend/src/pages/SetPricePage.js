import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Button, Select, notification } from 'antd';
import axios from 'axios';

const { Option } = Select;

const SetPricePage = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);

  // Fetch product names
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/product-models'); // Endpoint to fetch all product models
        setProducts(response.data);
      } catch (error) {
        notification.error({
          message: 'Error',
          description: 'Failed to fetch product names. Please try again later.',
        });
      } finally {
        setProductLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { productId, newPrice } = values;
      await axios.put(`/api/product-models/${productId}/price`, null, {
        params: { newPrice: newPrice },
      })
      notification.success({
        message: 'Price Updated', 
        description:  `New price of the product ID: ${productId} is ${newPrice}.`,
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to update product price. Please check the product and price.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Product Name"
        name="productId"
        rules={[{ required: true, message: 'Please select a product!' }]}
      >
        <Select
          placeholder="Select a product"
          loading={productLoading}
          style={{ width: '100%' }}
        >
          {products.map((product) => (
            <Option key={product.id} value={product.id}>
              {product.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Price (TL)"
        name="newPrice"
        rules={[{ required: true, message: 'Please input the new price!' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder="Enter New Price"
          min={0}
        />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Apply Price
      </Button>
    </Form>
  );
};

export default SetPricePage;
