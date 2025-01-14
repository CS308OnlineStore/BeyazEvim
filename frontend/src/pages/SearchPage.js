import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  Divider,
  Select,
} from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  HeartOutlined,
  HeartFilled,
} from '@ant-design/icons';
import ShoppingCart from './ShoppingCart'; // Ensure this component exists
import newLogo from '../assets/BeyazEvim_new_logo.jpeg';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State Variables
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [cartNum, setCartNum] = useState(parseInt(Cookies.get('cartNum')) || 0);
  const [userName, setUserName] = useState(Cookies.get('userName') || '');
  const [sortOption, setSortOption] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [isHeartHovered, setIsHeartHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchString = new URLSearchParams(location.search).get('searchString') || '';

  useEffect(() => {
    const token = Cookies.get('authToken');
    const userId = Cookies.get('userId');
    const userName = Cookies.get('userName');

    if (token && userId) {
      setUserName(userName);
      fetchCart(userId);
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    setSearchQuery(searchString);
    if (searchString.trim()) {
      setLoading(true);
      setError(null);

      axios
        .get(`/api/product-models/search/${encodeURIComponent(searchString.trim())}`)
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          console.error('Error fetching search results:', error);
          setError('Unable to fetch search results.');
        })
        .finally(() => setLoading(false));
    } else {
      setProducts([]);
    }
  }, [searchString]);

  useEffect(() => {
    if (products.length > 0) {
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
    }
  }, [sortOption, products]);

  const fetchCart = (userId) => {
    axios
      .get(`/api/orders/${userId}/cart`)
      .then((response) => {
        const { id, orderItems, totalPrice } = response.data;
        Cookies.set('cartId', id, { expires: 7 });
        setCartNum(orderItems.length);
        Cookies.set('cartNum', orderItems.length, { expires: 7 });
        Cookies.set('totalPrice', totalPrice, { expires: 7 });
      })
      .catch((error) => console.error('Error fetching cart:', error));
  };

  const fetchCategories = () => {
    axios
      .get('/api/categories/root')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Error fetching categories:', error));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert('Please enter a search term.');
      return;
    }
    navigate(`/search?searchString=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleWishlistClick = () => {
    if (userName) {
      navigate('/wishlist');
    } else {
      alert('Please log in to access your wishlist!');
      navigate('/signinsignup');
    }
  };

  const handleUserPageClick = () => {
    navigate('/userpage');
  };

  const handleLoginClick = () => {
    navigate('/signinsignup');
  };

  const handleCartClick = () => {
    setIsCartVisible(true);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Layout>
      {/* Sidebar */}
      <Sider width={250} style={{ background: '#fff' }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <img
            src={newLogo}
            alt="BeyazEvim Logo"
            style={{ width: '150px', height: '150px', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          />
        </div>
        <Menu mode="inline" defaultSelectedKeys={[]}>
          <Menu.ItemGroup title="Filtreler">
            {categories.map((category) => (
              <Menu.SubMenu key={category.id} title={category.categoryName}>
                {category.subCategories
                  .filter((subcategory) => subcategory.active)
                  .map((subcategory) => (
                    <Menu.Item
                      key={subcategory.id}
                      onClick={() => navigate(`/category/${subcategory.id}`)}
                    >
                      {subcategory.categoryName}
                    </Menu.Item>
                  ))}
              </Menu.SubMenu>
            ))}
          </Menu.ItemGroup>
        </Menu>
      </Sider>

      {/* Main Layout */}
      <Layout>
        <Header
          style={{
            background: '#001529',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', width: '50%' }}>
            <Input
              placeholder="What are you looking for?"
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                marginTop: '5px',
                marginBottom: '5px',
                borderRadius: '5px',
              }}
              onPressEnter={handleSearchSubmit}
            />
          </form>

          {/* User and Cart Icons */}
          <div>
            {userName ? (
              <Button
                type="link"
                icon={<UserOutlined />}
                onClick={handleUserPageClick}
                style={{ color: 'white' }}
              >
                {userName}
              </Button>
            ) : (
              <Button type="primary" onClick={handleLoginClick}>
                Login
              </Button>
            )}
            <span
              onMouseEnter={() => setIsHeartHovered(true)}
              onMouseLeave={() => setIsHeartHovered(false)}
              onClick={handleWishlistClick}
              style={{ marginLeft: '20px', cursor: 'pointer', fontSize: '24px', color: 'white' }}
            >
              {isHeartHovered ? <HeartFilled /> : <HeartOutlined />}
            </span>
            <Badge count={cartNum}>
              <ShoppingCartOutlined
                onClick={handleCartClick}
                style={{
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: 'white',
                  marginLeft: '20px',
                }}
              />
            </Badge>
          </div>
        </Header>

        <Content style={{ padding: '20px' }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
            <Title level={4}>Sort:</Title>
            <Select
              value={sortOption}
              onChange={(value) => setSortOption(value)}
              style={{ width: 200 }}
            >
              <Option value="default">Default</Option>
              <Option value="popularity">Popularity</Option>
              <Option value="alphabetical">Alphabetical</Option>
              <Option value="price">Price</Option>
            </Select>
          </Row>

          {searchString.trim() ? (
            <>
              <Title level={3} style={{ marginBottom: '20px' }}>
                Search results for "{searchString}"
              </Title>
              {loading && <Text>Loading...</Text>}
              {error && <Text type="danger">{error}</Text>}
              <Row gutter={[16, 16]}>
                {products.length > 0 ? (
                  products.map((product) => (
                    <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                      <Card
                        hoverable
                        style={{
                          height: '350px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                        cover={
                          <div
                            style={{
                              overflow: 'hidden',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: '150px',
                            }}
                          >
                            <img
                              alt={product.name}
                              src={product.image_path || 'https://via.placeholder.com/150'}
                              style={{
                                width: '150px',
                                height: '150px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                transition: 'transform 0.3s ease',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            />
                          </div>
                        }
                        onClick={() => handleProductClick(product.id)}
                      >
                        <Card.Meta
                          title={product.name}
                          description={
                            <div
                              style={{
                                height: '50px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                              }}
                            >
                              {product.description}
                            </div>
                          }
                        />
                        <Divider />
                        <Text strong>
                          {product.stockCount > 0 ? `₺${product.price}` : 'OUT OF STOCK'}
                        </Text>
                      </Card>
                    </Col>
                  ))
                ) : (
                  !loading && <Text>No products found for your search.</Text>
                )}
              </Row>
            </>
          ) : (
            <Title level={3}>Enter a search term to see results.</Title>
          )}
        </Content>

        <Drawer
          title="Your Cart"
          placement="right"
          onClose={() => setIsCartVisible(false)}
          visible={isCartVisible}
          width={400}
        >
          <ShoppingCart onClose={() => setIsCartVisible(false)} />
        </Drawer>
      </Layout>
    </Layout>
  );
};

export default SearchPage;
