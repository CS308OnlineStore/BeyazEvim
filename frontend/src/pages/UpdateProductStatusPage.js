import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Select, InputNumber, Button, message, Layout, Typography } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const UpdateProductStatusPage = () => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState(null);
  const [currentStock, setCurrentStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingStock, setFetchingStock] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/homepage');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        message.error('Failed to load products.');
      }
    };

    fetchProducts();
  }, []);

  const handleProductSelect = async (value) => {
    try {
      const selectedProduct = products.find((product) => product.name === value);

      if (!selectedProduct) {
        throw new Error('Product not found');
      }

      setFetchingStock(true);
      setCurrentStock(selectedProduct.stockCount);
      setProductId(selectedProduct.id);
      message.success(`Current stock for "${selectedProduct.name}": ${selectedProduct.stockCount}`);
    } catch (error) {
      console.error('Error selecting product:', error);
      message.error('Failed to fetch product stock.');
      setCurrentStock(null);
      setProductId(null);
    } finally {
      setFetchingStock(false);
    }
  };

  // Stoğu güncelleme fonksiyonu
  const handleIncreaseStock = async () => {
    try {
      if (!productId) {
        message.error('Please fetch a product first.');
        return;
      }

      const values = await form.validateFields(['quantityToAdd']);

      setLoading(true);

      const response = await axios.post(`/api/product-models/${productId}/stock`, values)

      setCurrentStock(response.data.updatedStock); 
      message.success(`Product stock increased successfully!`);
      form.resetFields(['quantity']);
    } catch (error) {
      console.error(`Error updating stock: `, error);
      message.error(`Failed to update product stock.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDecreaseStock = async () => {
    try {
      if (!productId) {
        message.error('Please fetch a product first.');
        return;
      }

      const { quantityToAdd } = await form.validateFields(['quantityToAdd']);

      setLoading(true);

      const response = await axios.post(`/api/products/${productId}/decrease-stock`, null, { params: {quantityToRemove: quantityToAdd }})

      setCurrentStock(response.data.updatedStock); 
      message.success(`Product stock decreased successfully!`);
      form.resetFields(['quantity']);
    } catch (error) {
      console.error(`Error updating stock: `, error);
      message.error(`Failed to update product stock.`);
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
          {/* Product Selection */}
          <Form.Item
              name="productName"
              label="Product Name"
              rules={[{ required: true, message: 'Please select a product' }]}
            >
            <Select
              placeholder="Select a Product"
              onChange={handleProductSelect}
              loading={fetchingStock}
            >
              {products.map((product) => (
                <Option key={product.id} value={product.name}>
                  {product.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Mevcut Stok Bilgisi */}
          {currentStock !== null && (
            <div style={{ marginBottom: '20px' }}>
              <Title level={4}>Current Stock: {currentStock}</Title>
            </div>
          )}

          {/* Stok Güncelleme */}
          <Form.Item
            name="quantityToAdd"
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
              onClick={() => handleIncreaseStock()}
              loading={loading}
              style={{ marginRight: '10px' }}
            >
              Increase Stock
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={() => handleDecreaseStock()}
              loading={loading}
              style={{ marginRight: '10px' }}
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
