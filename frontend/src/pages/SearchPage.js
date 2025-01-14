import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  Layout,
  Input,
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
import { ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons';
import ShoppingCart from './ShoppingCart';
import newLogo from '../assets/BeyazEvim_new_logo.jpeg';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State Variables
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtrelenmiş ürünler
  const [brands, setBrands] = useState([]); // Dinamik olarak ürünlerden çıkarılan markalar
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [cartNum, setCartNum] = useState(parseInt(Cookies.get('cartNum')) || 0);
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

    if (token && userId) {
      fetchCart(userId);
    }

    fetchProducts(searchString); // Ürünleri getir ve markaları çıkart
  }, [searchString]);

  useEffect(() => {
    applyFilters(); // Fiyat, marka ve sıralamaya göre filtreleme uygula
  }, [priceRange, selectedBrands, sortOption]);

  const fetchCart = (userId) => {
    axios
      .get(`/api/orders/${userId}/cart`)
      .then((response) => {
        const { id, orderItems, totalPrice } = response.data;
        Cookies.set('cartId', id, { expires: 7 });
        setCartNum(orderItems.length);
      })
      .catch((error) => console.error('Error fetching cart:', error));
  };

  const fetchProducts = (query) => {
    if (!query.trim()) {
      setProducts([]);
      setBrands([]);
      return;
    }

    setLoading(true);
    axios
      .get(`/api/product-models/search/${encodeURIComponent(query.trim())}`)
      .then((response) => {
        const products = response.data;

        // Markaları dinamik olarak ürünlerden çıkar
        const uniqueBrands = [...new Set(products.map((product) => product.brand))];
        setBrands(uniqueBrands);

        setProducts(products);
        setFilteredProducts(products); // Tüm ürünleri başlangıçta filtrelenmiş ürünler olarak ayarla
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setError('Unable to fetch search results.');
      })
      .finally(() => setLoading(false));
  };

  const applyFilters = () => {
    let filtered = products.filter(
      (product) =>
        product.price >= priceRange[0] &&
        product.price <= priceRange[1] &&
        (selectedBrands.length === 0 || selectedBrands.includes(product.brand)) // Marka filtreleme
    );

    switch (sortOption) {
      case 'alphabetical':
        filtered.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );
        break;
      case 'priceLowToHigh':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighToLow':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered); // Filtrelenmiş ürünleri güncelle
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert('Please enter a search term.');
      return;
    }
    navigate(`/search?searchString=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Layout>
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
            options={brands.map((brand) => ({ label: brand, value: brand }))}
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

      <Layout>
        <Header style={{ background: '#001529', display: 'flex', justifyContent: 'space-between' }}>
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
            />
          </form>

          <Badge count={cartNum}>
            <ShoppingCartOutlined
              onClick={() => setIsCartVisible(true)}
              style={{ fontSize: '24px', cursor: 'pointer', color: 'white' }}
            />
          </Badge>
        </Header>

        <Content style={{ padding: '20px' }}>
          {loading ? (
            <Text>Loading...</Text>
          ) : error ? (
            <Text type="danger">{error}</Text>
          ) : filteredProducts.length > 0 ? ( // Filtrelenmiş ürünleri göster
            <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
              {products
                .filter((product) => product.price > 0)
                .map((product) => (
                  <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      style={{
                        height: '350px', // Set a fixed height for the card
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                      cover={
                        <div
                          style={{
                            overflow: 'hidden', // Ensures image stays within its container
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '150px', // Same as the image height
                          }}
                        >
                          <img
                            alt={product.name}
                            src={product.image_path}
                            style={{
                              width: '150px', // Initial width
                              height: '150px', // Initial height
                              objectFit: 'cover',
                              borderRadius: '8px',
                              transition: 'transform 0.3s ease', // Smooth zoom effect
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')} // Zoom in
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} // Reset zoom
                          />
                        </div>
                      }
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <Card.Meta
                        title={product.name}
                        description={
                          <div
                            style={{
                              height: '50px', // Limit description height
                              overflow: 'hidden', // Hide overflow
                              textOverflow: 'ellipsis', // Add ellipsis if text overflows
                              display: '-webkit-box',
                              WebkitLineClamp: 2, // Limit to 2 lines
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {product.description}
                          </div>
                        }
                      />
                      <Divider />
                      <Text strong>
                        {product.stockCount > 0 ? (
                          product.discount > 0 ? (
                            <>
                              <span style={{ textDecoration: 'line-through', marginRight: '8px' }}>
                                ₺{product.price}
                              </span>
                              <span>₺{product.discountedPrice}</span>
                            </>
                          ) : (
                            `₺${product.price}`
                          )
                        ) : (
                          'OUT OF STOCK'
                        )}
                      </Text>
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
