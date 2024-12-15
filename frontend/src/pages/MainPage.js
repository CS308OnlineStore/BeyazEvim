import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  Layout,
  Menu,
  Input,
  Button,
  Badge,
  Drawer,
  Card,
  Typography,
  Row,
  Col,
  Avatar,
  Divider,
  Select,
} from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import logo from '../assets/BeyazEvim_logo.jpeg';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const MainPage = () => {
  const navigate = useNavigate();

  // State Variables
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [cartNum, setCartNum] = useState(0);
  const [userName, setUserName] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch Initial Data
  useEffect(() => {
    const token = Cookies.get('authToken');
    const userId = Cookies.get('userId');
    const userName = Cookies.get('userName');

    if (token && userId) {
      setUserName(userName);
      fetchCart(userId);
    } else {
      fetchGuestCart();
    }

    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProductsWithSorting();
  }, [sortOption]);

  const fetchCart = (userId) => {
    axios
      .get(`/api/orders/${userId}/cart`)
      .then((response) => {
        const { totalPrice, orderItems } = response.data;
        setCartItems(orderItems);
        setTotalPrice(totalPrice);
        setCartNum(orderItems.length);
      })
      .catch((error) => console.error('Error fetching cart:', error));
  };

  const fetchGuestCart = () => {
    const guestCart = JSON.parse(localStorage.getItem('cart')) || { items: [], totalPrice: 0.0 };
    setCartItems(guestCart.items);
    setTotalPrice(guestCart.totalPrice);
    setCartNum(guestCart.items.length);
  };

  const fetchProducts = () => {
    axios
      .get('/api/homepage')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  };

  const fetchCategories = () => {
    axios
      .get('/api/categories/root')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Error fetching categories:', error));
  };

  const fetchProductsWithSorting = () => {
    let sortedProducts = [...products];
    switch (sortOption) {
      case 'popularity':
        sortedProducts.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'alphabetical':
        sortedProducts.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );
        break;
      case 'price':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      default:
        break;
    }
    setProducts(sortedProducts);
  };

  const removeItem = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    const updatedTotal = cartItems.reduce(
      (sum, item) => (item.id !== itemId ? sum + item.price * item.quantity : sum),
      0
    );
    setTotalPrice(updatedTotal);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert('Please enter a search term.');
      return;
    }
    navigate(`/search?searchString=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <Layout>
      {/* Sidebar */}
      <Sider width={250} style={{ background: '#fff' }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <img src={logo} alt="BeyazEvim Logo" style={{ width: '50px', height: '50px' }} />
          <Title level={3}>BeyazEvim</Title>
        </div>
        <Menu mode="inline">
          {categories.map((category) => (
            <Menu.SubMenu key={category.id} title={category.categoryName}>
              {category.subCategories.map((subcategory) => (
                <Menu.Item key={subcategory.id} onClick={() => navigate(`/category/${subcategory.id}`)}>
                  {subcategory.categoryName}
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ))}
        </Menu>
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header style={{ background: '#001529', display: 'flex', justifyContent: 'space-between' }}>
          <Input
            placeholder="What are you looking for?"
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '50%' }}
            onPressEnter={handleSearchSubmit}
          />
          <div>
            {userName ? (
              <Button type="link" icon={<UserOutlined />}>
                {userName}
              </Button>
            ) : (
              <Button type="primary" onClick={() => navigate('/signinsignup')}>
                Login
              </Button>
            )}
            <Badge count={cartNum}>
              <ShoppingCartOutlined
                onClick={() => setIsCartVisible(true)}
                style={{ fontSize: '24px', cursor: 'pointer', color: 'white', marginLeft: '20px' }}
              />
            </Badge>
          </div>
        </Header>

        {/* Content */}
        <Content style={{ padding: '20px' }}>
          <Row justify="space-between" style={{ marginBottom: '20px' }}>
            <Title level={4}>Sort by:</Title>
            <Select value={sortOption} onChange={(value) => setSortOption(value)} style={{ width: 200 }}>
              <Option value="default">Default</Option>
              <Option value="popularity">Popularity</Option>
              <Option value="alphabetical">Alphabetical</Option>
              <Option value="price">Price</Option>
            </Select>
          </Row>
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={<img alt={product.name} src={product.image || 'https://via.placeholder.com/150'} />}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <Card.Meta title={product.name} description={product.description} />
                  <Divider />
                  <Text strong>
                    {product.stockCount > 0 ? `₺${product.price}` : 'OUT OF STOCK'}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </Content>

        {/* Shopping Cart Drawer */}
        <Drawer
          title="Your Shopping Cart"
          placement="right"
          onClose={() => setIsCartVisible(false)}
          visible={isCartVisible}
          width={400}
        >
          {cartItems.length > 0 ? (
            <>
              {cartItems.map((item) => (
                <Card key={item.id} style={{ marginBottom: '10px' }}>
                  <Row align="middle">
                    <Col span={6}>
                      <Avatar
                        shape="square"
                        size={64}
                        src={item.image || 'https://via.placeholder.com/64'}
                        alt={item.name}
                      />
                    </Col>
                    <Col span={12}>
                      <Text strong>{item.name}</Text>
                      <br />
                      <Text>{item.quantity} x ₺{item.price}</Text>
                    </Col>
                    <Col span={6} style={{ textAlign: 'right' }}>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeItem(item.id)}
                      />
                    </Col>
                  </Row>
                </Card>
              ))}
              <Divider />
              <Title level={4} style={{ textAlign: 'right' }}>
                Total: ₺{totalPrice.toFixed(2)}
              </Title>
            </>
          ) : (
            <Text>Your cart is empty.</Text>
          )}
        </Drawer>
      </Layout>
    </Layout>
  );
};

export default MainPage;
