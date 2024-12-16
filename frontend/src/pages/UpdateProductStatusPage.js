import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, InputNumber, Button, message, Layout, Typography } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

const UpdateProductStatusPage = () => {
  const [form] = Form.useForm();
  const [currentStock, setCurrentStock] = useState(null);
  const [productId, setProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingStock, setFetchingStock] = useState(false);

  // Ürün adını kullanarak stoğu getirme fonksiyonu
  const handleFetchStock = async () => {
    try {
      const values = await form.validateFields(['productName']);
      const { productName } = values;

      setFetchingStock(true);

      const response = await axios.get('/api/product-models', {
        params: { name: productName }, // Ürün adına göre filtreleme
      });

      const product = response.data[0]; // İlk eşleşen ürünü al
      if (!product) {
        throw new Error('Product not found');
      }

      setCurrentStock(product.stock);
      setProductId(product.id);
      message.success(`Current stock for "${product.name}": ${product.stock}`);
    } catch (error) {
      console.error('Error fetching product:', error);
      message.error('Failed to fetch product. Check the product name.');
      setCurrentStock(null);
      setProductId(null);
    } finally {
      setFetchingStock(false);
    }
  };

  // Stoğu güncelleme fonksiyonu
  const handleUpdateStock = async (operation) => {
    try {
      if (!productId) {
        message.error('Please fetch a product first.');
        return;
      }

      const values = await form.validateFields(['quantity']);
      const { quantity } = values;

      setLoading(true);

      const response = await axios.put(`/api/product-models/${productId}`, {
        operation: operation, // "increase" veya "decrease"
        quantity: quantity,
      });

      setCurrentStock(response.data.stock); // Güncel stok bilgisini güncelle
      message.success(`Product stock ${operation === 'increase' ? 'increased' : 'decreased'} successfully!`);
      form.resetFields(['quantity']);
    } catch (error) {
      console.error(`Error updating stock (${operation}):`, error);
      message.error(`Failed to ${operation} product stock.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Header>
        <Title style={{ color: 'white', margin: '16px 0' }} level={2}>
          Update Product Stock
        </Title>
      </Header>
      <Content style={{ padding: '20px' }}>
        <Form form={form} layout="vertical">
          {/* Ürün Adı Girişi */}
          <Form.Item
            name="productName"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter the Product Name' }]}
          >
            <Input placeholder="Enter Product Name" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={handleFetchStock}
              loading={fetchingStock}
            >
              Fetch Stock
            </Button>
          </Form.Item>

          {/* Mevcut Stok Bilgisi */}
          {currentStock !== null && (
            <div style={{ marginBottom: '20px' }}>
              <Title level={4}>Current Stock: {currentStock}</Title>
            </div>
          )}

          {/* Stok Güncelleme */}
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[
              { required: true, message: 'Please enter the Quantity' },
              { type: 'number', min: 1, message: 'Quantity must be at least 1' },
            ]}
          >
            <InputNumber
              placeholder="Enter Quantity"
              style={{ width: '100%' }}
              min={1}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={() => handleUpdateStock('increase')}
              loading={loading}
              style={{ marginRight: '10px' }}
            >
              Increase Stock
            </Button>
            <Button
              type="primary"
              onClick={() => handleUpdateStock('decrease')}
              loading={loading}
            >
              Decrease Stock
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default UpdateProductStatusPage;
