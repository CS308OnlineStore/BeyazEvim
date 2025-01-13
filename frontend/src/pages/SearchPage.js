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
import ShoppingCart from './ShoppingCart'; // Bu bileşenin mevcut olduğundan emin olun
import newLogo from '../assets/BeyazEvim_new_logo.jpeg';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Durum Değişkenleri
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

  // Bileşen Yüklendiğinde Çalışacak Etkiler
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

  // Arama Sorgusuna ve Sıralamaya Göre Ürünleri Çek
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
          console.error('Arama sonuçları alınırken hata oluştu:', error);
          setError('Arama sonuçları alınamadı.');
        })
        .finally(() => setLoading(false));
    } else {
      setProducts([]);
    }
  }, [searchString]);

  // Sıralama Seçeneğine Göre Ürünleri Sırala
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

  // Sepeti Çek
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
      .catch((error) => console.error('Sepet alınırken hata oluştu:', error));
  };

  // Kategorileri Çek
  const fetchCategories = () => {
    axios
      .get('/api/categories/root')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Kategoriler alınırken hata oluştu:', error));
  };

  // Arama Formu Gönderme
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      // Ant Design'ın message bileşenini kullanarak daha iyi bir kullanıcı deneyimi sağlayabilirsiniz
      alert('Lütfen bir arama terimi girin.');
      return;
    }
    navigate(`/search?searchString=${encodeURIComponent(searchQuery.trim())}`);
  };

  // Favorilere Ekleme (Wishlist) Tıklaması
  const handleWishlistClick = () => {
    if (userName) {
      navigate('/wishlist');
    } else {
      alert('Favorilere eklemeden önce giriş yapmalısınız!');
      navigate('/signinsignup');
    }
  };

  // Kullanıcı Sayfasına Gitme
  const handleUserPageClick = () => {
    navigate('/userpage');
  };

  // Giriş Yapma
  const handleLoginClick = () => {
    navigate('/signinsignup');
  };

  // Sepeti Gösterme
  const handleCartClick = () => {
    setIsCartVisible(true);
  };

  // Ürüne Gitme
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Layout>
      {/* Yan Menü (Sidebar) */}
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
        </Menu>
      </Sider>

      {/* Ana Düzen */}
      <Layout>
        {/* Üst Kısım (Header) */}
        <Header
          style={{
            background: '#001529',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Arama Formu */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', width: '50%' }}>
            <Input
              placeholder="Ne arıyorsunuz?"
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
            {/* Arama Butonu Kaldırıldı */}
          </form>

          {/* Kullanıcı ve Sepet İkonları */}
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
                Giriş Yap
              </Button>
            )}
            {/* Favori İkonu */}
            <span
              onMouseEnter={() => setIsHeartHovered(true)}
              onMouseLeave={() => setIsHeartHovered(false)}
              onClick={handleWishlistClick}
              style={{ marginLeft: '20px', cursor: 'pointer', fontSize: '24px', color: 'white' }}
            >
              {isHeartHovered ? <HeartFilled /> : <HeartOutlined />}
            </span>
            {/* Sepet İkonu */}
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

        {/* İçerik Bölümü */}
        <Content style={{ padding: '20px' }}>
          {/* Sıralama Seçeneği */}
          <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
            <Title level={4}>Sırala:</Title>
            <Select
              value={sortOption}
              onChange={(value) => setSortOption(value)}
              style={{ width: 200 }}
            >
              <Option value="default">Varsayılan</Option>
              <Option value="popularity">Popülerlik</Option>
              <Option value="alphabetical">Alfabetik</Option>
              <Option value="price">Fiyat</Option>
            </Select>
          </Row>

          {/* Arama Sonuçları */}
          {searchString.trim() ? (
            <>
              <Title level={3} style={{ marginBottom: '20px' }}>
                "{searchString}" için Arama Sonuçları
              </Title>
              {loading && <Text>Yükleniyor...</Text>}
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
                          {product.stockCount > 0 ? `₺${product.price}` : 'STOKTA YOK'}
                        </Text>
                      </Card>
                    </Col>
                  ))
                ) : (
                  !loading && <Text>Aramanız için hiçbir ürün bulunamadı.</Text>
                )}
              </Row>
            </>
          ) : (
            <Title level={3}>Arama sonuçlarını görmek için bir arama terimi girin.</Title>
          )}
        </Content>

        {/* Altta Olabilir: Sepet Çekmecesi */}
        <Drawer
          title="Sepetiniz"
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
