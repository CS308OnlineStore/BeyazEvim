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
  Slider,
  Checkbox,
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
  const [brands, setBrands] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [cartNum, setCartNum] = useState(parseInt(Cookies.get('cartNum')) || 0);
  const [userName, setUserName] = useState(Cookies.get('userName') || '');
  const [sortOption, setSortOption] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
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

    fetchBrands();
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
    applyFilters();
  }, [priceRange, selectedBrands, sortOption]);

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

  const fetchBrands = () => {
    axios
      .get('/api/brands')
      .then((response) => setBrands(response.data))
      .catch((error) => console.error('Error fetching brands:', error));
  };

  const applyFilters = () => {
    let filteredProducts = products.filter(
      (product) =>
        product.price >= priceRange[0] &&
        product.price <= priceRange[1] &&
        (selectedBrands.length === 0 || selectedBrands.includes(product.brand))
    );

    switch (sortOption) {
      case 'alphabetical':
        filteredProducts.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );
        break;
      case 'priceLowToHigh':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighToLow':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setProducts(filteredProducts);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert('Please enter a search term.');
      return;
    }
    navigate(`/search?searchString=${encodeURIComponent(searchQuery.trim())}`);
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
        <div style={{ padding: '20px' }}>
          <Title level={4}>Filter by Price</Title>
          <Slider
            range
            min={0}
            max={1000}
            step={10}
            value={priceRange}
            onChange={(value) => setPriceRange(value)}
            marks={{ 0: '₺0', 1000: '₺1000' }}
          />

          <Divider />

          <Title level={4}>Filter by Brand</Title>
          <Checkbox.Group
            options={brands.map((brand) => ({ label: brand.name, value: brand.name }))}
            value={selectedBrands}
            onChange={(checkedValues) => setSelectedBrands(checkedValues)}
          />

          <Divider />

          <Title level={4}>Sort By</Title>
          <Select
            value={sortOption}
            onChange={(value) => setSortOption(value)}
            style={{ width: '100%' }}
          >
            <Option value="default">Default</Option>
            <Option value="alphabetical">Alphabetical</Option>
            <Option value="priceLowToHigh">Price: Low to High</Option>
            <Option value="priceHighToLow">Price: High to Low</Option>
          </Select>
        </div>
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

          {/* Cart and User */}
          <div>
            <Badge count={cartNum}>
              <ShoppingCartOutlined
                onClick={handleCartClick}
                style={{ fontSize: '24px', cursor: 'pointer', color: 'white', marginLeft: '20px' }}
              />
            </Badge>
          </div>
        </Header>

        <Content style={{ padding: '20px' }}>
          {loading ? (
            <Text>Loading...</Text>
          ) : error ? (
            <Text type="danger">{error}</Text>
          ) : products.length > 0 ? (
            <Row gutter={[16, 16]}>
              {products.map((product) => (
                <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    onClick={() => handleProductClick(product.id)}
                    cover={<img alt={product.name} src={product.image_path || 'https://via.placeholder.com/150'} />}
                  >
                    <Card.Meta title={product.name} description={`₺${product.price}`} />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Text>No products found.</Text>
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
