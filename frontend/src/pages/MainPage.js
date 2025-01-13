import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import ShoppingCart from './ShoppingCart';
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
  Carousel,
} from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  HeartOutlined,
  HeartFilled,
} from '@ant-design/icons';
import newLogo from '../assets/BeyazEvim_new_logo.jpeg';
import slide1 from '../assets/slide1.jpg';
import slide2 from '../assets/slide2.jpg';
import slide3 from '../assets/slide3.jpg';
import slide4 from '../assets/slide4.jpg';


const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const MainPage = () => {
  const navigate = useNavigate();

  // State Variables
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [cartNum, setCartNum] = useState(0);
  const [userName, setUserName] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [isHeartHovered, setIsHeartHovered] = useState(false);

  // Fetch Initial Data
  useEffect(() => {
    const token = Cookies.get('authToken');
    const userId = Cookies.get('userId');
    const userName = Cookies.get('userName');

    if (token && userId) {
      setUserName(userName);
      fetchCart(userId);
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
        const { id, orderItems } = response.data;
        Cookies.set('cartId', id, { expires: 7 });
        setCartNum(orderItems.length);
      })
      .catch((error) => console.error('Error fetching cart:', error));
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert('Please enter a search term.');
      return;
    }
    navigate(`/search?searchString=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handeWishlistClick = () =>{
    if (userName){
      navigate('/wishlist')
    } else {
      alert('Please SignIn before using wishlist!');
      navigate('/signinsignup');
    }
  }

  return (
    <Layout>
      {/* Sidebar */}
      <Sider width={250} style={{ background: '#fff' }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <img 
            src={newLogo} 
            alt="BeyazEvim Logo" 
            style={{ width: '150px', height: '150px' }} 
          />
        </div>
        <Menu mode="inline">
          {categories.map((category) => (
            <Menu.SubMenu key={category.id} title={category.categoryName}>
              {category.subCategories.filter((subcategory) => subcategory.active)
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
            style={{
              width: '50%', // Enini kontrol eder
              height: '40px', // Boyunu kontrol eder
              marginTop: '5px', // Üstten boşluk
              marginBottom: '5px', // Alttan boşluk
              borderRadius: '5px', // Kenar yuvarlatma (isteğe bağlı)
            }}
            onPressEnter={handleSearchSubmit}
          />
          <div>
            {userName ? (
              <Button type="link" icon={<UserOutlined />} onClick={() => navigate('/userpage')}>
                {userName}
              </Button>
            ) : (
              <Button type="primary" onClick={() => navigate('/signinsignup')}>
                Login
              </Button>
            )}
            {/* Heart Icon for Wishlist */}
            <span
              onMouseEnter={() => setIsHeartHovered(true)}
              onMouseLeave={() => setIsHeartHovered(false)}
              onClick={handeWishlistClick}
              style={{ marginLeft: '20px', cursor: 'pointer', fontSize: '24px', color: 'white' }}
            >
              {isHeartHovered ? <HeartFilled /> : <HeartOutlined />}
            </span>
            <Badge count={cartNum}>
              <ShoppingCartOutlined
                onClick={() => setIsCartVisible(true)}
                style={{ fontSize: '24px', cursor: 'pointer', color: 'white', marginLeft: '20px' }}
              />
            </Badge>
          </div>
        </Header>

        {/* Carousel */}
        <Content style={{ padding: '20px' }}>
        <Carousel autoplay>
            <div>
              <img src={slide1} alt="Slide 1" style={{ width: '100%', height: 'auto' }} />
            </div>
            <div>
              <img src={slide2} alt="Slide 2" style={{ width: '100%', height: 'auto' }} />
            </div>
            <div>
              <img src={slide3} alt="Slide 3" style={{ width: '100%', height: 'auto' }} />
            </div>
            <div>
              <img src={slide4} alt="Slide 4" style={{ width: '100%', height: 'auto' }} />
            </div>
          </Carousel>

          
          
          {/* Product Grid */}
          <Row justify="space-between" style={{ marginTop: '20px' }}>
            <Title level={4}>Sort by:</Title>
            <Select value={sortOption} onChange={(value) => setSortOption(value)} style={{ width: 200 }}>
              <Option value="default">Default</Option>
              <Option value="popularity">Popularity</Option>
              <Option value="alphabetical">Alphabetical</Option>
              <Option value="price">Price</Option>
            </Select>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
            {products.map((product) => (
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
                    <img 
                      alt={product.name} 
                      src={product.image_path} 
                      style={{
                        width: '150px', // Set your desired width
                        height: '150px', // Set your desired height
                        objectFit: 'cover', // Ensures the image is cropped proportionally
                        borderRadius: '8px', // Optional: Adds rounded corners
                        margin: 'auto', // Centers the image
                      }}
                      />}
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
          <ShoppingCart onClose={() => setIsCartVisible(false)} />
        </Drawer>
      </Layout>
    </Layout>
  );
};



export default MainPage;

