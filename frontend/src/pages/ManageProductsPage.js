import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  message,
  Layout,
  Typography,
  Space,
  Spin,
  Alert,
  Divider,
  List,
  Popconfirm,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const ManageProductsPage = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kategorileri ve ürünleri çekme
  useEffect(() => {
    const fetchCategories = axios.get('/api/categories');
    const fetchProducts = axios.get('/api/product-models');

    Promise.all([fetchCategories, fetchProducts])
      .then(([categoriesResponse, productsResponse]) => {
        setCategories(categoriesResponse.data);
        setProducts(productsResponse.data);
        setLoading(false);
      })
      .catch(() => {
        message.error('Veriler yüklenirken bir hata oluştu.');
        setError('Veriler yüklenirken bir hata oluştu.');
        setLoading(false);
      });
  }, []);

  // Alt kategorileri çekme
  const handleCategoryChange = (value) => {
    axios
      .get(`/api/categories`)
      .then((res) => {
        setSubcategories(res.data);
        form.setFieldsValue({ subcategoryId: undefined });
      })
      .catch(() => {
        message.error('Alt kategoriler yüklenirken hata oluştu.');
        setSubcategories([]);
      });
  };

  // Ürün ekleme işlemi
  const handleAddProduct = async (values) => {
    const payload = {
      name: values.productName,
      description: values.productDescription,
      price: values.productPrice,
      distributorInformation: values.distributorInformation,
      photoPath: '/images/default.jpg',
      category: { id: values.subcategoryId || values.categoryId },
    };

    await axios.post('/api/product-models', payload)
      .then((response) => {
        message.success('Ürün başarıyla eklendi!');
        setProducts((prevProducts) => [...prevProducts, response.data]);
        form.resetFields();

        const addStock = {"quantityToAdd" : values.productStock}
        axios.post(`/api/product-models/${response.data.id}/stock`, addStock)
          .then(() => {
            message.success('Successfully updated stock!');
          })
          .catch(() => message.error('Failed to update stock'))
      })
      .catch(() => message.error('Failed to create item'));
    
    

    
  };

  // Ürün silme işlemi
  const handleRemoveProduct = (productId) => {
    axios
      .delete(`/api/product-models/${productId}`)
      .then(() => {
        message.success('Ürün başarıyla silindi!');
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      })
      .catch(() => message.error('Ürün silinirken bir hata oluştu.'));
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <Layout>
      <Header>
        <Title style={{ color: 'white', margin: '16px 0' }} level={2}>
          Manage Products
        </Title>
      </Header>
      <Content style={{ padding: '20px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Ürün Ekleme Formu */}
          <div>
            <Title level={3}>Add Product</Title>
            <Form form={form} layout="vertical" onFinish={handleAddProduct}>
              {/* Kategori Seçimi */}
              <Form.Item
                name="categoryId"
                label="Category"
                rules={[{ required: true, message: 'Please select a category' }]}
              >
                <Select placeholder="Select a Category" onChange={handleCategoryChange}>
                  {categories.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.categoryName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Alt Kategori Seçimi */}
              {subcategories.length > 0 && (
                <Form.Item name="subcategoryId" label="Subcategory">
                  <Select placeholder="Select a Subcategory">
                    {subcategories.map((subcategory) => (
                      <Option key={subcategory.id} value={subcategory.id}>
                        {subcategory.categoryName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

              {/* Ürün Adı */}
              <Form.Item
                name="productName"
                label="Product Name"
                rules={[{ required: true, message: 'Please enter the product name' }]}
              >
                <Input placeholder="Product Name" />
              </Form.Item>

              {/* Ürün Açıklaması */}
              <Form.Item
                name="productDescription"
                label="Product Description"
                rules={[{ required: true, message: 'Please enter the product description' }]}
              >
                <Input.TextArea placeholder="Product Description" />
              </Form.Item>

              {/* Ürün Fiyatı */}
              <Form.Item
                name="productPrice"
                label="Product Price"
                rules={[{ required: true, message: 'Please enter the product price' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>

              {/* Ürün Distribütör İsmi */}
              <Form.Item
                name="distributorInformation"
                label="Distributor Information"
                rules={[{ required: true, message: 'Please enter the distributor' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>

              {/* Ürün Stoğu */}
              <Form.Item
                name="productStock"
                label="Product Stock"
                rules={[{ required: true, message: 'Please enter the product stock' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>

              <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                Add Product
              </Button>
            </Form>
          </div>

          <Divider />

          {/* Ürün Listesi */}
          <div>
            <Title level={3}>Existing Products</Title>
            <List
              bordered
              dataSource={products}
              renderItem={(product) => (
                <List.Item
                  actions={[
                    <Popconfirm
                      title={`Are you sure to delete "${product.name}"?`}
                      onConfirm={() => handleRemoveProduct(product.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="link" danger icon={<MinusCircleOutlined />}>
                        Remove
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    title={product.name}
                    description={`Description: ${product.description} | Price: ₺${
                      product.discountedPrice || product.price
                    } | Stock: ${product.stockCount}`}
                  />
                </List.Item>
              )}
            />
          </div>
        </Space>
      </Content>
    </Layout>
  );
};

export default ManageProductsPage;
