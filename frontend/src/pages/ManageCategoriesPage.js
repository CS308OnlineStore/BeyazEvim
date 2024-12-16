import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  List,
  Input,
  Button,
  message,
  Layout,
  Typography,
  Popconfirm,
  Alert,
  Divider,
  Space,
  Spin,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title } = Typography;

const ManageCategoriesPage = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Alt kategori isimlerini geçici olarak saklamak için state
  const [subCategoryInputs, setSubCategoryInputs] = useState({});

  useEffect(() => {
    // Fetch all categories
    axios
      .get('/api/categories')
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setError('Failed to fetch categories.');
        setLoading(false);
      });
  }, []);

  const handleAddCategory = () => {
    if (!categoryName.trim()) {
      message.warning('Please enter a valid category name.');
      return;
    }

    // Add new category
    axios
      .post('/api/categories', { categoryName })
      .then((response) => {
        message.success('Category added successfully!');
        setCategories((prevCategories) => [...prevCategories, response.data]);
        setCategoryName('');
      })
      .catch((error) => {
        console.error('Error adding category:', error);
        message.error('Failed to add category.');
      });
  };

  const handleRemoveCategory = (categoryId) => {
    // Remove category
    axios
      .delete(`/api/categories/${categoryId}`)
      .then(() => {
        message.success('Category removed successfully!');
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== categoryId)
        );
      })
      .catch((error) => {
        console.error('Error removing category:', error);
        message.error('Failed to remove category.');
      });
  };

  const handleAddSubCategory = (categoryId) => {
    const subCategoryName = subCategoryInputs[categoryId];
    if (!subCategoryName || !subCategoryName.trim()) {
      message.warning('Please enter a valid subcategory name.');
      return;
    }

    // Add new subcategory
    axios
      .post(`/api/categories/${categoryId}/subcategories`, { subcategoryName: subCategoryName })
      .then((response) => {
        message.success('Subcategory added successfully!');
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === categoryId
              ? { ...category, subcategories: [...category.subcategories, response.data] }
              : category
          )
        );
        setSubCategoryInputs((prevInputs) => ({ ...prevInputs, [categoryId]: '' }));
      })
      .catch((error) => {
        console.error('Error adding subcategory:', error);
        message.error('Failed to add subcategory.');
      });
  };

  const handleRemoveSubCategory = (categoryId, subCategoryId) => {
    // Remove subcategory
    axios
      .delete(`/api/categories/${categoryId}/subcategories/${subCategoryId}`)
      .then(() => {
        message.success('Subcategory removed successfully!');
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === categoryId
              ? {
                  ...category,
                  subcategories: category.subcategories.filter(
                    (subcategory) => subcategory.id !== subCategoryId
                  ),
                }
              : category
          )
        );
      })
      .catch((error) => {
        console.error('Error removing subcategory:', error);
        message.error('Failed to remove subcategory.');
      });
  };

  const handleSubCategoryInputChange = (categoryId, value) => {
    setSubCategoryInputs((prevInputs) => ({ ...prevInputs, [categoryId]: value }));
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
          Manage Categories
        </Title>
      </Header>
      <Content style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Space>
            <Input
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              style={{ width: '300px' }}
            />
            <Button type="primary" onClick={handleAddCategory} icon={<PlusOutlined />}>
              Add Category
            </Button>
          </Space>
        </div>
        <Divider />
        <List
          header={<div>Existing Categories</div>}
          bordered
          dataSource={categories}
          renderItem={(category) => (
            <List.Item key={category.id}>
              <div style={{ width: '100%' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Title level={5}>{category.categoryName}</Title>
                    <Popconfirm
                      title="Are you sure to delete this category?"
                      onConfirm={() => handleRemoveCategory(category.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="link" danger icon={<MinusCircleOutlined />}>
                        Remove
                      </Button>
                    </Popconfirm>
                  </Space>
                  {/* Alt Kategorileri Listeleme */}
                  {category.subcategories && category.subcategories.length > 0 ? (
                    <List
                      size="small"
                      bordered
                      dataSource={category.subcategories}
                      renderItem={(subcategory) => (
                        <List.Item key={subcategory.id}>
                          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                            {subcategory.subcategoryName}
                            <Popconfirm
                              title="Are you sure to delete this subcategory?"
                              onConfirm={() => handleRemoveSubCategory(category.id, subcategory.id)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button type="link" danger icon={<MinusCircleOutlined />}>
                                Remove
                              </Button>
                            </Popconfirm>
                          </Space>
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Alert message="No subcategories." type="info" showIcon />
                  )}
                  {/* Alt Kategori Ekleme */}
                  <Space>
                    <Input
                      placeholder="Subcategory Name"
                      value={subCategoryInputs[category.id] || ''}
                      onChange={(e) => handleSubCategoryInputChange(category.id, e.target.value)}
                      style={{ width: '300px' }}
                    />
                    <Button
                      type="primary"
                      onClick={() => handleAddSubCategory(category.id)}
                      icon={<PlusOutlined />}
                    >
                      Add Subcategory
                    </Button>
                  </Space>
                </Space>
              </div>
            </List.Item>
          )}
        />
      </Content>
    </Layout>
  );
};

export default ManageCategoriesPage;
